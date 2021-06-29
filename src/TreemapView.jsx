import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function TreemapView({ data, width, height }) {
  const svgRef = useRef(null);

  function renderTreemap() {
    const svg = d3.select(svgRef.current);
    svg.selectAll('g').remove();
    svg.attr('viewBox', [0, 0, width, height]).style('font', '10px sans-serif');

    const root = d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    const treemapRoot = d3.treemap().size([width, height]).padding(1)(root);

    const nodes = svg
      .selectAll('g')
      .data(treemapRoot.leaves())
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    const fader = color => d3.interpolateRgb(color, '#fff')(0.3);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10.map(fader));

    nodes.attr('cursor', 'pointer').on('click', function () {
      d3.selectAll('g').style('stroke', null); // or attr("stroke", null)
      d3.select(this).style('stroke', 'red');
    });

    nodes
      .append('rect')
      .attr('fill', d => {
        while (d.depth > 1) d = d.parent;
        return colorScale(d.data.name);
      })
      .attr('fill-opacity', 1.0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0);

    const format = d3.format(',d');
    nodes.append('title').text(
      d =>
        `${d
          .ancestors()
          .reverse()
          .map(d => d.data.name)
          .join('/')}\n${format(d.value)}`,
    );

    nodes
      .append('text')
      .attr('clip-path', d => d.clipUid)
      .selectAll('tspan')
      .data(d =>
        d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)),
      )
      .join('tspan')
      .attr('x', 3)
      .attr(
        'y',
        (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`,
      )
      .attr('fill-opacity', (d, i, nodes) =>
        i === nodes.length - 1 ? 0.7 : null,
      )
      .text(d => d);
  }

  useEffect(() => {
    renderTreemap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} />
    </div>
  );
}
