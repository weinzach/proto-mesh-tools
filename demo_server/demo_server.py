import time
import socket
import signal

done = False
def sigint_handler(num, frame):
        done = True

def main():
        sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)
	sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
	sock.bind(('', 8192))
	#sock.listen(5)

	signal.signal(signal.SIGINT, sigint_handler)

        f = open("data_out.csv", "w")

        while True:
                #(client, addr) = sock.accept()
                pack, peer = sock.recvfrom(1024)
                #pack = client.recv(1024)
                #colors = [(int(x) if int(x) < 256 and int(x) >= 0 else 255) for x in pack.split(",")]
                #sense.clear(colors)
                #client.close()

                print "Got", pack

                f.write(pack + "\n")
                time.sleep(0.05)

        sock.shutdown()
        sock.close()
        f.close()

if __name__ == "__main__":
        main()
