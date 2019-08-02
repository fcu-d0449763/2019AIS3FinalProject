#!/usr/bin/python -u

import json
import sys
import struct
import importlib
import subprocess
import urllib
import re


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


def parse_sublist3r(sublist3r_output):
    if "Subdomains Found:" in sublist3r_output:
        return remove_ansi_escape('\n'.join(sublist3r_output.split("Found:")[-1].split("\n")[1:]))
    elif "Error: Please" in sublist3r_output:
        return "Error: Please enter a valid domain"
    else:
        return "No Results Found"

# TODO: Refactoring
def parse_dirsearch(dirsearch_output):
    if "] Starting:" not in dirsearch_output:
        return "ERROR"
    else:
        content = dirsearch_output.split("] Starting:")[-1]
        raw_lines = '\n['.join(remove_ansi_escape(content).split("[")).split("\n")
        lines = '\n'.join(list(filter(lambda x: ("Last request" not in x), raw_lines)))[1:-1]
        raw_results = lines.split("\n")
        results = '\n'.join(list(filter(lambda x: x != '', raw_results)[:-1]))
        return results

def remove_ansi_escape(text):
    # code from https://stackoverflow.com/questions/14693701/how-can-i-remove-the-ansi-escape-sequences-from-a-string-in-python
    ansi_escape = re.compile(r'''
    \x1B    # ESC
    [@-_]   # 7-bit C1 Fe
    [0-?]*  # Parameter bytes
    [ -/]*  # Intermediate bytes
    [@-~]   # Final byte
''', re.VERBOSE)
    return ansi_escape.sub('', text)


while True:
    message = get_message()
    request = json.loads(message)
    if request['mode'] == "bfac":
        try:
            result = subprocess.check_output(["./bfac/bfac", "-u", request['body'], "-level", "1"])
            response = {
                "mode" : request['mode'],
                "sender" : request['sender'],
                "body" : parse_bfac(result)
            }
            send_message(encode_message(json.dumps(response)))
        except Exception as e:
            send_message(encode_message("ERROR"))
    elif request['mode'] == "sublist3r":
        try:
            result = subprocess.check_output(["python", "Sublist3r/sublist3r.py", "-d", request['body']])
            response = {
                "mode" : request['mode'],
                "sender" : request['sender'],
                "body": parse_sublist3r(result)
            }
            send_message(encode_message(json.dumps(response)))
        except Exception as e:
            send_message(encode_message("ERROR"))
    elif request['mode'] == "dirsearch":
        try:
            result = subprocess.check_output([
                "dirsearch/dirsearch.py", "-u",
                request['body'], "-w", "dirsearch/db/dicc.txt",
                "--random-agents", "-e", "php,asp,html", "-b"])
            print(result)
            response = {
                "mode" : request['mode'],
                "sender" : request['sender'],
                "body": parse_dirsearch(result)
            }
            print(response)
            send_message(encode_message(json.dumps(response)))
        except Exception as e:
            send_message(encode_message("ERROR"))
