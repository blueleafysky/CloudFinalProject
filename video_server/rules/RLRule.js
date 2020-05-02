var HighestBitrateRule;
var startRebufferTime = 0;
var endRebufferTime = 0;
var startRebufferCalc = false;
var latestRebufferTime = null;

// Rule that selects the lowest possible bitrate
function RLRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let StreamController = factory.getSingletonFactoryByName('StreamController');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let Debug = factory.getSingletonFactoryByName('Debug');
    let context = this.context;
    let instance;

    function setup() {
    }

    // Always use lowest bitrate
    function getMaxIndex(rulesContext) {
        // here you can get some informations about metrics for example, to implement the rule
        let metricsModel = MetricsModel(context).getInstance();
        var mediaType = rulesContext.getMediaInfo().type;
        var metrics = metricsModel.getMetricsFor(mediaType, true);
        let dashMetrics = DashMetrics(context).getInstance();
        let debug = Debug(context).getInstance();
        console.log(debug);
        // const mediaInfo = rulesContext.getMediaInfo();
        // A smarter (real) rule could need analyze playback metrics to take
        // bitrate switching decision. Printing metrics here as a reference
        console.log(metrics);

        // Get current bitrate
        let streamController = StreamController(context).getInstance();
        let abrController = rulesContext.getAbrController();
        let current = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo());
        let highest = abrController.getTopBitrateInfoFor(mediaType);
        // console.log(abrController.getBitrateList(mediaInfo));
        // console.log(abrController.getTopBitrateInfoFor(mediaType)); 
        // If already in lowest bitrate, don't do anything
        let lastQuality = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo());
        console.log(lastQuality)
        let buffer = dashMetrics.getCurrentBufferLevel(mediaType);
        console.log(buffer)
        let a = dashMetrics.getCurrentBufferState(mediaType);

        // Try and estimate total rebuffering time
        if(a != null && a.state == "bufferStalled" && startRebufferCalc == false){
            console.log("bufferStalled");
            startRebufferTime = Date.now();
            startRebufferCalc = true;
        }
        if(startRebufferCalc == true && a.state != "bufferStalled"){
            console.log("calculating rebuffering");
            endRebufferTime = Date.now();
            latestRebufferTime = (endRebufferTime - startRebufferTime)/1000;
            startRebufferCalc = false;
        }
        if(latestRebufferTime != null){
            console.log(latestRebufferTime);
            latestRebufferTime = null;
        }
        console.log(a);
        console.log(context);
        // let bufferAdjusted =
        // let bandwidthEst =
        // let lastRequest
        // let lastRequested =
        // let video = document.querySelector("video");
        // let rebufferTime = video.total_rebuffer_time;
        // console.log(rebufferTime);
        // let lastChunkFinishTime =
        // let lastChuckStartTime = 
        // let lastChunkSize =
        // var data = {'lastquality': lastQuality, 'buffer': bufferLevel, 'bufferAdjusted': bufferLevelAdjusted, 'bandwidthEst': bandwidthEst, 
        //     'lastRequest': lastRequested, 'RebufferTime': window.total_rebuffer_time, 
        //     'lastChunkFinishTime': lastHTTPRequest.tfinish.getTime(), 'lastChunkStartTime': lastHTTPRequest.tresponse.getTime(), 
        //     'lastChunkSize': self.vbr.getChunkSize(lastRequested, lastQuality)};
        var data = {'a':'b'};
        var getPy = $.ajax({
            type: "POST",
            url: restAPI + "testABR",   
            async: false,
            data: { mydata: data }
        });
        console.log('THIS INFORMATION:' + getPy.responseText);
        let q = parseInt(getPy.responseText);
        // if (current === highest) {
        //     return SwitchRequest(context).create();
        // }

        // Ask to switch to the lowest bitrate
        let switchRequest = SwitchRequest(context).create();
        switchRequest.quality = q;
        switchRequest.reason = 'Switch to RL predicted rate';
        switchRequest.priority = SwitchRequest.PRIORITY.STRONG;
        return switchRequest;
    }

    instance = {
        getMaxIndex: getMaxIndex
    };

    setup();

    return instance;
}

RLRuleClass.__dashjs_factory_name = 'RLRule';
RLRule = dashjs.FactoryMaker.getClassFactory(RLRuleClass);