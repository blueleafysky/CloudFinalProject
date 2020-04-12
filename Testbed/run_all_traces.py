# adapted from https://github.com/hongzimao/pensieve/blob/master/run_exp/run_all_traces.py
import os
import time
import json
import urllib
import subprocess

TRACE_PATH = '../cooked_traces/'

with open('./chrome_retry_log', 'wb') as f:
	f.write('chrome retry log\n')

# for Mahimahi initial setup
os.system('sudo sysctl -w net.ipv4.ip_forward=1')
ip_data = json.loads(urllib.urlopen("http://ip.jsontest.com/").read())
ip = str(ip_data['ip'])

print ip

# LIST ALGOS HERE TO RUN OTHER TRACES
ABR_ALGO = "RL"
PROCESS_ID = 0
command_rl = 'python run_traces.py ' + TRACE_PATH + ' ' + ABR_ALGO + ' ' + str(PROCESS_ID) + ' ' + ip

print command_rl

# Processes
process_rl = subprocess.Popen(command_rl, stdout=subprocess.PIPE, shell=True)
time.sleep(0.1)

process_rl.wait()
