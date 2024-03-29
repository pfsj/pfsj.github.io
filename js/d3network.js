// Animate network

    var graph;
    function myGraph() {

        // Add and remove elements on the graph object
        this.addNode = function (id,group) {
            nodes.push({"id": id,"group":group});
            update();
        };

        this.removeNode = function (id) {
            var i = 0;
            var n = findNode(id);
            while (i < links.length) {
                if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
                    links.splice(i, 1);
                }
                else i++;
            }
            nodes.splice(findNodeIndex(id), 1);
            update();
        };

        this.removeLink = function (source, target) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].source.id == source && links[i].target.id == target) {
                    links.splice(i, 1);
                    break;
                }
            }
            update();
        };

        this.removeallLinks = function () {
            links.splice(0, links.length);
            update();
        };

        this.removeAllNodes = function () {
            nodes.splice(0, links.length);
            update();
        };

        this.addLink = function (source, target, value) {
            links.push({"source": findNode(source), "target": findNode(target), "value": value});
            update();
        };

        var findNode = function (id) {
            for (var i in nodes) {
                if (nodes[i]["id"] === id) return nodes[i];
            }
            ;
        };

        var findNodeIndex = function (id) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id == id) {
                    return i;
                }
            }
            ;
        };

        // set up the D3 visualisation in the specified element
        var w = 300,
            h = 300;

        var color = d3.scale.category10();

        var vis = d3.select(".network")
          .attr("width", w)
          .attr("height", h);
        //  .on('mousedown',addNodes);


        var force = d3.layout.force();

        var nodes = force.nodes(),
                links = force.links();

        var update = function () {
            var link = vis.selectAll("line")
                    .data(links, function (d) {
                        return d.source.id + "-" + d.target.id;
                    });

            link.enter().append("line")
                    .attr("id", function (d) {
                        return d.source.id + "-" + d.target.id;
                    })
                    .attr("stroke-width", function (d) {
                        return d.value / 10;
                    })
                    .attr("class", "link");
            link.append("title")
                    .text(function (d) {
                        return d.value;
                    });
            link.exit().remove();

            var node = vis.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id;
                    });

            var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .call(force.drag);

            nodeEnter.append("svg:circle")
                    .attr("r", 9)
                    .attr("id", function (d) {
                        return "Node;" + d.id;
                    })
                    .attr("class", "nodeStrokeClass")
                    .attr("fill", function(d) { return color(d.group); })

            nodeEnter.append("svg:text")
                    .attr("class", "textClass")
                    .attr("x", 14)
                    .attr("y", ".31em");

            node.exit().remove();

            force.on("tick", function () {

                node.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

                link.attr("x1", function (d) {
                    return d.source.x;
                })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });
            });

            // Restart the force layout.
            force
                    .gravity(.08)
                    .charge(-200)
                    .linkDistance(50)
                    .size([w, h])
                    .start();
        };


        // Make it all go
        update();
    }

    function drawGraph() {

        graph = new myGraph("#svgdiv");


        graph.addNode('Sophia',1);
        graph.addNode('Daniel',1);
        graph.addNode('Ryan',2);
        graph.addNode('Lila',2);
        graph.addNode('Suzie',3);
        graph.addNode('Riley',3);
        graph.addNode('Grace',4);
        graph.addNode('Dylan',4);
        graph.addNode('Mason',4);
        graph.addNode('Emma',1);
        graph.addLink('Mason', 'Ryan', '20');
        graph.addLink('Sophia', 'Ryan', '20');
        graph.addLink('Daniel', 'Grace', '20');
        graph.addLink('Suzie', 'Lila', '20');

        keepNodesOnTop();}

    function changeGraph() {
        // callback for the changes in the network
        var step = -1;
        function nextval()
        {
            step++;
            return 2000 + (1500*step); // initial time, wait time
        }

        var tupleTest = ['Emma', 'Sophia'];

        setTimeout(function() {
            graph.addLink(tupleTest[0], tupleTest[1], '20');
            graph.removeLink('Suzie', 'Lila');
            keepNodesOnTop();
        }, nextval());

        setTimeout(function() {
            graph.addLink('Sophia', 'Daniel', '20');
            graph.removeLink('Mason', 'Ryan');
            graph.addLink('Lila','Riley','20');
            keepNodesOnTop();
        }, nextval());

        setTimeout(function() {
            graph.addLink('Daniel', 'Emma', '20');
            graph.removeLink('Sophia', 'Daniel');
            keepNodesOnTop();
        }, nextval());

        setTimeout(function() {
            graph.addLink('Suzie', 'Daniel', '20');

            keepNodesOnTop();
        }, nextval());

        setTimeout(function() {
            graph.addLink('Mason', 'Ryan','20');
            keepNodesOnTop();
        }, nextval());

        setTimeout(function() {
            graph.removeLink('Daniel', 'Emma');
            graph.addLink('Dylan', 'Emma', '20');
            graph.removeLink('Lila','Riley');
            keepNodesOnTop();
        }, nextval());

        setTimeout(function() {       
            graph.removeLink('Dylan', 'Mason');
            graph.removeLink('Suzie', 'Daniel', '20');
            keepNodesOnTop();
        }, nextval());

        setTimeout(function() {
            graph.addLink('Suzie', 'Lila', '20');
            graph.removeLink('Emma', 'Sophia');
            graph.removeLink('Dylan', 'Emma');
            keepNodesOnTop();
        }, nextval());

        setTimeout(function() {
           addNodes()
        }, nextval());
    }

    drawGraph();
    changeGraph();
    //setTimeout(function() {addNodes(),2000+9*1500});

    // because of the way the network is created, nodes are created first, and links second,
    // so the lines were on top of the nodes, this just reorders the DOM to put the svg:g on top
    function keepNodesOnTop() {
        $(".nodeStrokeClass").each(function( index ) {
            var gnode = this.parentNode;
            gnode.parentNode.appendChild(gnode);
        });
    }
    function addNodes() {
        d3.select("#svgdiv")
                .remove();
         changeGraph();
    }