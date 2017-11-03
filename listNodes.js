#!/usr/bin/env node
/* -*- Mode:js */
/* vim: set expandtab ts=4 sw=4: */
/*
 * You may redistribute this program and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
var Cjdns = require('/etc/proto-mesh/cjdns/tools/lib/cjdnsadmin/cjdnsadmin');
var nThen = require('nthen');

var nodeIP = [];
var nodePing = [];

function printNodes(){
	for (i = 0; i < nodeIP.length; i++) { 
		console.log("["+i+"] "+nodeIP[i]);
	}
}

Cjdns.connectWithAdminInfo(function (cjdns) {

    var nodes = [];
    var lags = [];
    nThen(function (waitFor) {

        var again = function (i) {
            cjdns.NodeStore_dumpTable(i, waitFor(function (err, table) {
                if (err) { throw err; }
                var j;
                for (j = 0; j < table.routingTable.length; j++) {
                    var r = table.routingTable[j];
                    nodes.push(r);
                }
                if (j) {
                    again(i+1);
                }
            }));
        };
        again(0);

    }).nThen(function (waitFor) {

        nodes.sort(function (a,b) { return (Number(a.link) < Number(b.link)) ? 1 : -1 });

        var ips = [];
        var uniques = [];
		console.log((nodes.length-1)+' Peer(s) Connected:');
        nodes.forEach(function (node) {
            if (node.path !== '0000.0000.0000.0001' && ips.indexOf(node.ip) === -1) {
                uniques.push(node);
                ips.push(node.ip);
            }
        });

        var switchLabel;
        var nt = nThen;
        uniques.forEach(function (node) {
            nt = nt(function (waitFor) {
                cjdns.NodeStore_nodeForAddr(node.ip, waitFor(function (err, ret) {
                    if (err) { throw err; }
                    nodeIP.push(node.ip.toString());
                }));
            }).nThen;
        });

        nt(waitFor());

    }).nThen(function (waitFor) {
		printNodes();
        cjdns.disconnect();
    });

});
