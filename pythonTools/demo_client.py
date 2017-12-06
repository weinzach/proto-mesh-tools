#!/usr/bin/env python2
# You may redistribute this program and/or modify it under the terms of
# the GNU General Public License as published by the Free Software Foundation,
# either version 3 of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

import sys
import getopt
import cjdnsadmin.adminTools as at
from cjdnsadmin.publicToIp6 import PublicToIp6_convert;
import time
import socket
import signal
from random    import randint
from sense_hat import SenseHat

sense = SenseHat()

done = False
def sigint_handler(num, frame):
        done = True

def clientDemo(address):
        signal.signal(signal.SIGINT, sigint_handler)
        print("Sending to "+address)
        while True:
                #sense.stick.wait_for_event()
                #col = [randint(0,255), randint(0,255), randint(0,255)]
                col = [sense.get_humidity(), sense.get_temperature(), sense.get_pressure()]
                col = ','.join([str(x) for x in col])
                print "Sending", col
                sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)
                sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                sock.connect((address, 8192))
                sock.sendall(col)
                sock.close()
                time.sleep(1)

        sock.shutdown()
        sock.close()
        
def main():
    cjdns=at.anonConnect()
    nodes = (at.peerStats(cjdns,verbose=False,human_readable=True))
    print("Choose a Node to Emit to: ")
    for i in range(0,len(nodes)):
        print(str(i)+" "+PublicToIp6_convert(nodes[i]['publicKey']))
    cjdns.disconnect()
    address = int(raw_input(": "))
    address = str(PublicToIp6_convert(nodes[address]['publicKey']))
    clientDemo(address)

if __name__ == "__main__":
        main()

