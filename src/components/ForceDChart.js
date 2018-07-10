import React, { Component } from 'react';
import * as d3 from 'd3';
import './graph.css'
// import $ from 'jquery';
/* 相关API
    d3.forceSimulation - 创建一个力模拟。
    simulation.restart - 重启力模拟。
    simulation.stop - 停止力模拟。
    simulation.tick - 将力模拟向前推进一步。
    simulation.nodes - 设置力模拟的节点。
    simulation.alpha - 设置当前的α值。
    simulation.alphaMin -设置α最小阈值。
    simulation.alphaDecay - 设置α指数衰减率。
    simulation.alphaTarget - 设置目标α。
    simulation.drag - 设置曳引系数。
    simulation.force - 添加或移除力。
    simulation.fix - 固定节点位置。
    simulation.unfix - 释放固定的节点。
    simulation.find - 查找给定位置最近的节点。
    simulation.on - 添加或移除事件监听器。
    force - 应用力模拟。
    force.initialize - 使用给定的节点初始化力布局。
    d3.forceCenter - 创建一个力中心。
    center.x - 设置中心的x-坐标。
    center.y - 设置中心的y-坐标。
    d3.forceCollide - 创建一个圆碰撞力。
    collide.radius - 设置圆的半径。
    collide.strength - 设置碰撞检测强度。
    collide.iterations - 设置迭代次数。
    d3.forceLink - 创建连接力。
    link.links - 设置连接数组。
    link.id - 连接数组。
    link.distance - 设置连接距离。
    link.strength - 设置连接强度。
    link.iterations - 设置迭代次数。
    d3.forceManyBody - 创建多体力。
    manyBody.strength - 设置力强度。
    manyBody.theta - 设置Barnes-Hut近似精度。
    manyBody.distanceMin - 当节点关闭限制力。
    manyBody.distanceMax - 当节点太远限制力。
    d3.forceX - 创建x-定位力。
    x.strength - 设置力强度。
    x.x - 设置目标x-坐标。
    d3.forceY - 创建y-定位力。
    y.strength - 设置力强度。
    y.y - 设置目标y-坐标。
    */

class ForceDChart extends Component{
  state = {

  }
  componentDidMount(){
    let canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width,
        height = canvas.height,
        root,
        nodes,
        links,
        simulation;
    let z = d3.scaleOrdinal(d3.schemeCategory20);

    d3.csv("./d3.csv", function (error, data) {
      if (error) {
        throw error;
      };
      root = d3.stratify()
          .id(function(d) { return d.path; })
          .parentId(function(d) {
            // console.log(d.path.substring(0, d.path.lastIndexOf("/")));
            return d.path.substring(0, d.path.lastIndexOf("/"));
          })(data);

      nodes = root.descendants();
      links = root.links();

      simulation = d3.forceSimulation(nodes)
          .force("charge", d3.forceManyBody())
          .force("link", d3.forceLink(links).strength(1))
          .force("x", d3.forceX())
          .force("y", d3.forceY())
          .on("tick", ticked);

      d3.select(canvas)
        .call(d3.drag()
        .container(canvas)
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    });

    function ticked() {
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);

      context.beginPath();
      links.forEach(drawLink);
      context.strokeStyle = "#aaa";
      context.stroke();

      context.beginPath();
      nodes.forEach(drawNode);
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      context.restore();
    }

    function dragsubject() {
      return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
    }

    function dragged(d) {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
    }

    let data = {
      nodes: [
          {"id": "Nike"},//0
          {"id": "Apple"},//1
          {"id": "Adidas"},//2
          {"id": "Mcdonald"},//3
          {"id": "KFC"},//4
          {"id": "JackMa"},//5
          {"id": "Tencent"},//6
          {"id": "Toyota"},//7
          {"id": "Geely"},//8
          {"id": "USA"},//9
          {"id": "Samsung"},//10
          {"id": "Adidas China"},//11
          {"id": "KFC China"},//12
          {"id": "Alibaba"},//13
          {"id": "JD.com"},//14
          {"id": "Tesla"},//15
      ],
      links: [ // value越小关系越近
          { "source": 0 , "target": 9 , "relation":"acquired", "year": "2011", value: 3 },
          { "source": 1 , "target": 10, "relation":"sued", "year": "2012", value: 3 },
          { "source": 1 , "target": 2 , "relation":"sued", "year": "2012", value: 6 },
          { "source": 1 , "target": 11 , "relation":"decreased stake of", "year": "2014", value: 6 },
          { "source": 3 , "target": 9 , "relation":"increased stake of", "year": "2014", value: 7 },
          { "source": 4 , "target": 12 , "relation":"decreased stake of", "year": "2015", value: 7 },
          { "source": 5 , "target": 13 , "relation":"is CEO of", "year": "2015", value: 3 },
          { "source": 6 , "target": 14 , "relation":"increased stake of", "year": "2016", value: 3 },
          { "source": 7 , "target": 15 , "relation":"cooperated with", "year": "2016", value: 1 },
          { "source": 8 , "target": 15 , "relation":"aquired", "year": "2017", value: 2 },
      ],
    };
    let width2 = 1024;
    let height2 = 768;
    let xAxisValue = '2011';
    let z2 = d3.scaleOrdinal(d3.schemeCategory20);
    let svg = d3.select('svg');

    let simulation2 = d3.forceSimulation() // 构建力导向图
        .force('link', d3.forceLink()
          .strength(1)
          .id(function(d, i) { return i; })
          .distance(function(d) { return d.value * 60; }))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(width2 / 2, height2 / 2));
    // draw

    function draw(edges, nodes) {
      let originalLink = svg.selectAll("g.links line");
      svg.selectAll("g.links").remove();

      let link = svg.append("g") // 画关系节点连接线
          .attr("class", "links")
          .style("stroke","#aaa")
          .selectAll("line")
          .data(edges).enter().append("line");
          console.log(link);
      link = link.merge(originalLink);

      let originalLinktext = svg.selectAll("g.link-text line");
      svg.selectAll("g.link-text").remove();
      let linkText = svg.append("g") // 画节点关系label
          .attr("class", "link-text")
          .style("user-select", "none")
          .selectAll("text")
          .data(edges)
          .enter().append("text")
          .text(function(d){
            return d.relation;
          });
      linkText = linkText.merge(originalLinktext);

      let originalNode = svg.selectAll("g.nodes g");
      svg.selectAll("g.nodes").remove();
      let node = svg.append("g") // 画节点和节点label
          .attr("class", "nodes")
          .style("user-select", "none")
          .style("font-weight", "bold")
          .style("font-family", "Helvetica")
          // .style("text-shadow", "0 0px 1px white")
          .selectAll("g")
          .data(nodes)
          .enter().append("g")
          .on("mouseover",function(d,i){
            //连接线加粗
            link.style('stroke-width', function(edge){
                if( edge.source === d || edge.target === d ){
                    return '2px';
                }
            }).style('stroke', function(edge){
                if( edge.source === d || edge.target === d ){
                    return '#000';
                }
            });
          })
          .on("mouseout",function(d,i){
            //连接线减粗
            link.style('stroke-width', function(edge){
                if( edge.source === d || edge.target === d ){
                  return '1px';
                }
            }).style('stroke', function(edge){
                if( edge.source === d || edge.target === d ){
                  return '#ddd';
                }
            });
          })
          .call(
            d3.drag()
            .on("start", dragstarted2)
            .on("drag", dragged2)
            .on("end", dragended2)
          );
      node = node.merge(originalNode);
      node.append('circle')
      .attr("r", 5)
      .attr('fill',function(d, i){return z2(i);});

      node.append("text")
      .attr('fill',function(d, i){return z2(i);})
      .attr("y", -20)
      .attr("dy", ".71em")
      .text(function(d) { return d.id; });

      simulation2 // 初始化力导向图
      .nodes(nodes)
      .on("tick", ticked2);

      simulation2.force("link")
      .links(edges);

      simulation2.alphaTarget(0.3).restart();

      function ticked2() { // 更新力学图
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        linkText
            .attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; })
            .attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });
        node
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      }

      function dragstarted2(d) {
        if (!d3.event.active) {
            simulation2.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged2(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended2(d) {
        if (!d3.event.active) {
            simulation2.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      }
    }
    // function draw(edges, nodes) {
    //   let link = svg.append("g") // 画关系节点连接线
    //       .attr("class", "links")
    //       .style("stroke","#aaa")
    //       .selectAll("line")
    //       .data(edges)
    //       .enter().append("line");
    //   link.exit().remove();
    //   let linkText = svg.append("g") // 画节点关系label
    //       .attr("class", "link-text")
    //       .style("user-select", "none")
    //       .selectAll("text")
    //       .data(edges)
    //       .enter().append("text")
    //       .text(function(d){
    //         return d.relation;
    //       });
    //   linkText.exit().remove();
    //   let node = svg.append("g") // 画节点和节点label
    //       .attr("class", "nodes")
    //       .style("user-select", "none")
    //       .style("font-weight", "bold")
    //       .style("font-family", "Helvetica")
    //       // .style("text-shadow", "0 0px 1px white")
    //       .selectAll("g")
    //       .data(nodes)
    //       .enter().append("g")
    //       .on("mouseover",function(d,i){
    //         //连接线加粗
    //         link.style('stroke-width', function(edge){
    //             if( edge.source === d || edge.target === d ){
    //                 return '2px';
    //             }
    //         }).style('stroke', function(edge){
    //             if( edge.source === d || edge.target === d ){
    //                 return '#000';
    //             }
    //         });
    //       })
    //       .on("mouseout",function(d,i){
    //         //连接线减粗
    //         link.style('stroke-width', function(edge){
    //             if( edge.source === d || edge.target === d ){
    //               return '1px';
    //             }
    //         }).style('stroke', function(edge){
    //             if( edge.source === d || edge.target === d ){
    //               return '#ddd';
    //             }
    //         });
    //       })
    //       .call(
    //         d3.drag()
    //         .on("start", dragstarted2)
    //         .on("drag", dragged2)
    //         .on("end", dragended2)
    //       );
    //   node.exit().remove();
    //   node.append('circle')
    //   .attr("r", 5)
    //   .attr('fill',function(d, i){return z2(i);});
    //
    //   node.append("text")
    //   .attr('fill',function(d, i){return z2(i);})
    //   .attr("y", -20)
    //   .attr("dy", ".71em")
    //   .text(function(d) { return d.id; });
    //
    //   simulation2 // 初始化力导向图
    //   .nodes(nodes)
    //   .on("tick", ticked2);
    //
    //   simulation2.force("link")
    //   .links(edges);
    //
    //   function ticked2() { // 更新力学图
    //     link
    //         .attr("x1", function(d) { return d.source.x; })
    //         .attr("y1", function(d) { return d.source.y; })
    //         .attr("x2", function(d) { return d.target.x; })
    //         .attr("y2", function(d) { return d.target.y; });
    //     linkText
    //         .attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; })
    //         .attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });
    //     node
    //         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    //   }
    //
    //   function dragstarted2(d) {
    //     if (!d3.event.active) {
    //         simulation2.alphaTarget(0.3).restart();
    //     }
    //     d.fx = d.x;
    //     d.fy = d.y;
    //   }
    //
    //   function dragged2(d) {
    //     d.fx = d3.event.x;
    //     d.fy = d3.event.y;
    //   }
    //
    //   function dragended2(d) {
    //     if (!d3.event.active) {
    //         simulation2.alphaTarget(0);
    //     }
    //     d.fx = null;
    //     d.fy = null;
    //   }
    // }
    // Start Time Range Slider
    let slider = svg.append('g')
        .classed('slider', true)
        .attr('transform', 'translate(' + 50 +', '+ (50 / 2) + ')');

    let step = 1;
    let range = [2011, 2018]
    // using clamp here to avoid slider exceeding the range limits
    let xScale = d3.scaleLinear()
        .domain(range)
        .range([0, 640])
        .clamp(true);

    // array useful for step sliders
    let rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);
    let xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
        return d;
    });

    xScale.clamp(true);
    // drag behavior initialization
    let drag = d3.drag()
        .on('start.interrupt', function () {
            slider.interrupt();
        }).on('start drag', function () {
            draggedranger(d3.event.x);
            let nodess = [];
            let mapdata = new Set();
            let edgess = data.links.filter(function (e, i) {
              if (e.year == xAxisValue) {
                mapdata.add(e.source.id);
                mapdata.add(e.target.id);
                return e;
              }
            })
            data.nodes.forEach((a) => {
              if (isInArray([...mapdata], a.id)) {
                nodess.push(a);
              }
            })
            if (edgess.length > 0 && nodess.length > 0) {

              draw(edgess, nodess);
            }
        });

    // this is the main bar with a stroke (applied through CSS)
    let track = slider.append('line').attr('class', 'track')
        .attr('x1', xScale.range()[0])
        .attr('x2', xScale.range()[1]);

    // this is a bar (steelblue) that's inside the main "track" to make it look like a rect with a border
    let trackInset = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset');

    let ticks = slider.append('g').attr('class', 'ticks').attr('transform', 'translate(0, 4)')
        .call(xAxis);

    // drag handle
    let handle = slider.append('circle').classed('handle', true)
        .attr('r', 10);

    // this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
    // try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
    let trackOverlay = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')
        .call(drag);

    // text to display
    // let text = svg.append('text').attr('transform', 'translate(' + (width/2) + ', ' + height/2 + ')')
    //     .text('Value: 0');

    // initial transition
    slider.transition().duration(750)
        .tween("drag", function () {
            let i = d3.interpolate(0, 10);
            return function (t) {
                draggedranger(xScale(i(t)));
                let nodess = [];
                let mapdata = new Set();
                let edgess = data.links.filter(function (e, i) {
                  if (e.year == xAxisValue) {
                    mapdata.add(e.source.id);
                    mapdata.add(e.target.id);
                    return e;
                  }
                })
                data.nodes.forEach((a) => {
                  if (isInArray([...mapdata], a.id)) {
                    nodess.push(a);
                  }
                })
                if (edgess.length > 0 && nodess.length > 0) {

                  draw(edgess, nodess);
                }
            }
        });

    function isInArray(arr,value){
      for(var i = 0; i < arr.length; i++){
          if(value === arr[i]){
              return true;
          }
      }
      return false;
    }

    function draggedranger(value) {
        let x = xScale.invert(value), index = null, midPoint, cx, xVal;
        if(step) {
            // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
            for (let i = 0; i < rangeValues.length - 1; i++) {
                if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                    index = i;
                    break;
                }
            }
            midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
            if (x < midPoint) {
                cx = xScale(rangeValues[index]);
                xVal = rangeValues[index];
            } else {
                cx = xScale(rangeValues[index + 1]);
                xVal = rangeValues[index + 1];
            }
        } else {
            // if step is null or 0, return the drag value as is
            cx = xScale(x);
            xVal = x.toFixed(3);
        }
        // use xVal as drag value
        handle.attr('cx', cx);
        // text.text('Value: ' + xVal);
        xAxisValue = xVal;
      }
    // End Time Range slider



    draw(data.links, data.nodes);
  }
    render() {
      return (
        <div>
          <canvas width="1024" height="640" style={{border: '1px solid black'}}></canvas>
          <svg width="1024" height="640" style={{border: '1px solid black'}}></svg>
        </div>
      );
    }
}

export default ForceDChart;
