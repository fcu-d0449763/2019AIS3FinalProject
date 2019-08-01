#!/usr/bin/python -u

import json
import sys
import struct
import importlib
import subprocess

# Read a message from stdin and decode it.  
def get_message():
    raw_length = sys.stdin.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.read(message_length)
    return json.loads(message)


# Encode a message for transmission, given its content.
def encode_message(message_content):
    encoded_content = json.dumps(message_content)
    encoded_length = struct.pack('=I', len(encoded_content))
    return {'length': encoded_length, 'content': encoded_content}


# Send an encoded message to stdout.
def send_message(encoded_message):
    sys.stdout.write(encoded_message['length'])
    sys.stdout.write(encoded_message['content'])
    sys.stdout.flush()

def parse_bfac(bfac_output):
    return bfac_output.split("[i] Findings:")[-1]   

while True:
    message = get_message()
    if message[:4] == "bfac":
        url = message[5:]
        try:
            result = subprocess.check_output(["./bfac/bfac", "-u", url, "-level", "1"])
            result = parse_bfac(result)
            send_message(encode_message(result))
        except Exception as e:
            send_message(encode_message("ERROR"))
    

