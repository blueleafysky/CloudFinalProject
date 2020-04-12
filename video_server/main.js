var player1;
var player2;
var controlbar1;
var controlbar2;
const url = 'http://localhost/Manifest.mpd'; //for local server start
// const url = 'http://10.0.0.2:8000/Manifest.mpd'; // for mininet

function startVideo() {
    var video1 = document.querySelector(".videoContainer video");
    var video2 = document.querySelector(".videoContainer_2 video");

    player1 = dashjs.MediaPlayer().create();
    player2 = dashjs.MediaPlayer().create();

    player1.initialize(video1, url, true);
    player2.initialize(video2, url, true);

    controlbar1 = new ControlBar(player1);
    controlbar1.initialize();

    controlbar2 = new ControlBar(player2);
    controlbar2.initialize('_2');

    player1.on(dashjs.MediaPlayer.events["PLAYBACK_ENDED"], function() {
        clearInterval(eventPoller);
        clearInterval(bitrateCalculator);
    });
    player2.on(dashjs.MediaPlayer.events["PLAYBACK_ENDED"], function() {
        clearInterval(eventPoller);
        clearInterval(bitrateCalculator);
    });
    var eventPoller = setInterval(function() {
        var streamInfo1 = player1.getActiveStream().getStreamInfo();
        var dashMetrics1 = player1.getDashMetrics();
        var dashAdapter1 = player1.getDashAdapter();

        var streamInfo2 = player2.getActiveStream().getStreamInfo();
        var dashMetrics2 = player2.getDashMetrics();
        var dashAdapter2 = player2.getDashAdapter();

        if (dashMetrics1 && streamInfo1) {
            const periodIdx = streamInfo1.index;
            var repSwitch = dashMetrics1.getCurrentRepresentationSwitch('video', true);
            var bufferLevel = dashMetrics1.getCurrentBufferLevel('video', true);
            var bitrate = repSwitch ? Math.round(dashAdapter1.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000) : NaN;
            document.getElementById('bufferLevel1').innerText = bufferLevel + " secs";
            document.getElementById('reportedBitrate1').innerText = bitrate + " Kbps";
        }

        if (dashMetrics2 && streamInfo2) {
            const periodIdx = streamInfo2.index;
            var repSwitch = dashMetrics2.getCurrentRepresentationSwitch('video', true);
            var bufferLevel = dashMetrics2.getCurrentBufferLevel('video', true);
            var bitrate = repSwitch ? Math.round(dashAdapter2.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000) : NaN;
            document.getElementById('bufferLevel2').innerText = bufferLevel + " secs";
            document.getElementById('reportedBitrate2').innerText = bitrate + " Kbps";
        }
    }, 1000);
    if (video1.webkitVideoDecodedByteCount !== undefined) {
        var lastDecodedByteCount = 0;
        const bitrateInterval = 5;
        var bitrateCalculator = setInterval(function() {
            var calculatedBitrate = (((video1.webkitVideoDecodedByteCount - lastDecodedByteCount) / 1000) * 8) / bitrateInterval;
            document.getElementById('calculatedBitrate1').innerText = Math.round(calculatedBitrate) + " Kbps";
            lastDecodedByteCount = video1.webkitVideoDecodedByteCount;
        }, bitrateInterval * 1000);
    }

    if (video2.webkitVideoDecodedByteCount !== undefined) {
        var lastDecodedByteCount2 = 0;
        const bitrateInterval2 = 5;
        var bitrateCalculator2 = setInterval(function() {
            var calculatedBitrate2 = (((video2.webkitVideoDecodedByteCount - lastDecodedByteCount2) / 1000) * 8) / bitrateInterval2;
            document.getElementById('calculatedBitrate2').innerText = Math.round(calculatedBitrate2) + " Kbps";
            lastDecodedByteCount2 = video2.webkitVideoDecodedByteCount;
        }, bitrateInterval2 * 1000);
    } 
}
function configurePlayback(inp) {
    var controlbar;
    var player;
    var stableBuffer;
    var bufferAtTopQuality;
    var minBitrate;
    var maxBitrate;
    var abr;
    var changeAbr;
    if(inp == 1){
        player = player1
        controlbar = controlbar1
        stableBuffer = parseInt(document.getElementById('stableBuffer1').value, 10);
        bufferAtTopQuality = parseInt(document.getElementById('topQualityBuffer1').value, 10);
        minBitrate = parseInt(document.getElementById('minBitrate1').value, 10);
        maxBitrate = parseInt(document.getElementById('maxBitrate1').value, 10);
        abr = document.getElementById('abr1').value;
        changeAbr = document.getElementById('changeabr1').checked;
    }
    if(inp == 2){
        player = player2
        controlbar = controlbar2
        stableBuffer = parseInt(document.getElementById('stableBuffer2').value, 10);
        bufferAtTopQuality = parseInt(document.getElementById('topQualityBuffer2').value, 10);
        minBitrate = parseInt(document.getElementById('minBitrate2').value, 10);
        maxBitrate = parseInt(document.getElementById('maxBitrate2').value, 10);
        abr = document.getElementById('abr2').value;
        changeAbr = document.getElementById('changeabr2').checked;

    }


    player.updateSettings({
        'streaming': {
            'stableBufferTime': stableBuffer,
            'bufferTimeAtTopQualityLongForm': bufferAtTopQuality,
            'abr': {
                'minBitrate': {
                    'video': minBitrate
                },
                'maxBitrate': {
                    'video': maxBitrate
                }
            }
        }
    })
    if(changeAbr){
        switch(abr){
            case 'LowestBitrateRule':
                player.removeABRCustomRule('ThroughputRule');
                player.removeABRCustomRule('DownloadRatioRule');
                player.addABRCustomRule('qualitySwitchRules', 'LowestBitrateRule', LowestBitrateRule);
                player.updateSettings({
                    'streaming': {
                        'abr': {
                            'useDefaultABRRules': false,
                            'ABRStrategy': 'LowestBitrateRule'
                        }
                    }
                });
                break;
            case 'DownloadRatioRule':
                player.removeABRCustomRule('LowestBitrateRule');
                player.removeABRCustomRule('ThroughputRule');
                player.addABRCustomRule('qualitySwitchRules', 'DownloadRatioRule', DownloadRatioRule);
                player.updateSettings({
                    'streaming': {
                        'abr': {
                            'useDefaultABRRules': false,
                            'ABRStrategy': 'DownloadRatioRule'
                        }
                    }
                });
                break;
            case 'ThroughputRule':
                player.removeABRCustomRule('LowestBitrateRule');
                player.removeABRCustomRule('DownloadRatioRule');
                player.addABRCustomRule('qualitySwitchRules', 'ThroughputRule', CustomThroughputRule);
                player.updateSettings({
                    'streaming': {
                        'abr': {
                            'useDefaultABRRules': false,
                            'ABRStrategy': 'ThroughputRule'
                        }
                    }
                });
                break;
            default:
                player.removeABRCustomRule('LowestBitrateRule');
                player.removeABRCustomRule('ThroughputRule');
                player.removeABRCustomRule('DownloadRatioRule');
                player.updateSettings({
                    'streaming': {
                        'abr': {
                            'useDefaultABRRules': true,
                        }
                    }
                });
        }
        player.attachSource(url);
        controlbar.reset();
    }
}