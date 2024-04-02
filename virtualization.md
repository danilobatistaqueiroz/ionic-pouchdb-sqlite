Title: Virtual machine using bridged network doesn't reach host's IP

I'm not a system admin, I'm a developer, patient, sorry by my ignorances.  
I need to run an http server in a machine and do request calls from my computer  
(requests from an Ip to another Ip).  
I don't have 2 computers than I'm using virtual machine to run my http server.  
I'm setting a **bridged network** for my virtual machine  
(As far as I know, NAT, internal network, and others settings won't work).  
I'm trying to use either Virtual Box or QEMU.  

I started creating a bridge interface, setting an IP and a route to the gateway.  
```sh
sudo brctl addbr virtbr0
sudo brctl addif virtbr0 enp2s0
sudo ip addr add 192.168.1.150/24 brd + dev virtbr0
sudo ip link set virtbr0 up
sudo iptables -I FORWARD -m physdev --physdev-is-bridged -j ACCEPT
sudo route add default gw 192.168.1.1 dev virtbr0
```

~$ ifconfig
```bsh
enp2s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.122  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 2804:868:d043:3b44:ccc3:3f61:44ca:48cf  prefixlen 64  scopeid 0x0<global>
        inet6 2804:868:d043:3b44:698:c5c0:8bb0:f11d  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::9dc4:6880:eb65:bce5  prefixlen 64  scopeid 0x20<link>
        ether 8c:b0:e9:d2:48:40  txqueuelen 1000  (Ethernet)
        RX packets 297525  bytes 392370899 (392.3 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 122387  bytes 13133599 (13.1 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3069  bytes 354280 (354.2 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3069  bytes 354280 (354.2 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

virtbr0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.150  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 2804:868:d043:3b44:a05e:e4ff:fec3:49ac  prefixlen 64  scopeid 0x0<global>
        inet6 2804:868:d043:3b44:6af9:89a6:31d0:d5a1  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::a05e:e4ff:fec3:49ac  prefixlen 64  scopeid 0x20<link>
        ether a2:5e:e4:c3:49:ac  txqueuelen 1000  (Ethernet)
        RX packets 2867  bytes 2133053 (2.1 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1997  bytes 204167 (204.1 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlo1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.27  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 2804:868:d043:3b44:18c3:51c9:ff85:a237  prefixlen 64  scopeid 0x0<global>
        inet6 2804:868:d043:3b44:e3df:e066:227c:b75c  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::c6c6:56b3:ddba:dd88  prefixlen 64  scopeid 0x20<link>
        ether 60:a5:e2:d7:3f:75  txqueuelen 1000  (Ethernet)
        RX packets 6158  bytes 4097263 (4.0 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 4506  bytes 893528 (893.5 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

ip route
```sh
default via 192.168.1.1 dev virtbr0 
default via 192.168.1.1 dev wlo1 proto dhcp metric 600 
default via 192.168.1.1 dev enp2s0 proto dhcp metric 20100 
192.168.1.0/24 dev virtbr0 proto kernel scope link src 192.168.1.150 
192.168.1.0/24 dev enp2s0 proto kernel scope link src 192.168.1.122 metric 100 
192.168.1.0/24 dev wlo1 proto kernel scope link src 192.168.1.27 metric 600 

```

Virtual Box Network Setup:  


Inside my Virtual Box machine the command **ifconfig** results:  
```sh
br-b70817717428: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.18.0.1  netmask 255.255.0.0  broadcast 172.18.255.255
        inet6 fe80::42:a1ff:fec6:9b83  prefixlen 64  scopeid 0x20<link>
        ether 02:42:a1:c6:9b:83  txqueuelen 0  (Ethernet)
        RX packets 656  bytes 5355126 (5.3 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 611  bytes 57002 (57.0 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:2aff:fe30:6ec2  prefixlen 64  scopeid 0x20<link>
        ether 02:42:2a:30:6e:c2  txqueuelen 0  (Ethernet)
        RX packets 2  bytes 152 (152.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2  bytes 196 (196.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.2  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::73c5:3d8:f371:ab18  prefixlen 64  scopeid 0x20<link>
        inet6 2804:868:d043:3b44:412d:e423:8450:978c  prefixlen 64  scopeid 0x0<global>
        inet6 2804:868:d043:3b44:677e:4ac8:9b8c:ed6b  prefixlen 64  scopeid 0x0<global>
        ether 08:00:27:7b:c5:aa  txqueuelen 1000  (Ethernet)
        RX packets 86483  bytes 120828194 (120.8 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 12384  bytes 1441375 (1.4 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 5281  bytes 3144582 (3.1 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 5281  bytes 3144582 (3.1 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

veth59defa9: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::d8b6:feff:fec6:ccc2  prefixlen 64  scopeid 0x20<link>
        ether da:b6:fe:c6:cc:c2  txqueuelen 0  (Ethernet)
        RX packets 656  bytes 5364310 (5.3 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 642  bytes 60520 (60.5 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

A ping from the virtual machine doesn't reach the host IP:  
```sh
ping 192.168.1.27
-or-  
ping 192.168.1.122
```

A ping from host to virtual machine either doesn't work.  


  [1]: https://i.stack.imgur.com/C21yb.png
