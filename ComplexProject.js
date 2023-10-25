/*
 * Filename: ComplexProject.js
 * Content: A complex and elaborate JavaScript project
 * Author: [Your Name]
 * Date: [Current Date]
 */

// Importing external libraries
import {_} from 'lodash';
import {axios} from 'axios';
import {moment} from 'moment';
import {d3} from 'd3';

// Global variables
let data = [];
let filteredData = [];
let selectedOption = 'option-1';
let currentDate = moment().format('YYYY-MM-DD');

// Fetching data from an API
async function fetchData() {
  try {
    const response = await axios.get('http://api.example.com/data');
    data = response.data;
    filterData();
    renderChart();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Filtering data based on selected option
function filterData() {
  switch (selectedOption) {
    case 'option-1':
      filteredData = data.filter(item => item.category === 'category-1');
      break;
    case 'option-2':
      filteredData = data.filter(item => item.category === 'category-2');
      break;
    case 'option-3':
      filteredData = data.filter(item => item.category === 'category-3');
      break;
    default:
      filteredData = data;
      break;
  }
}

// Rendering a chart using D3.js
function renderChart() {
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', 600)
    .attr('height', 400);

  const bars = svg.selectAll('rect')
    .data(filteredData);

  bars.enter()
    .append('rect')
    .attr('x', (_, i) => i * 40)
    .attr('y', d => 400 - d.value)
    .attr('width', 30)
    .attr('height', d => d.value)
    .attr('fill', 'steelblue');
}

// Event listeners
document.getElementById('option-1').addEventListener('click', () => {
  selectedOption = 'option-1';
  filterData();
  renderChart();
});

document.getElementById('option-2').addEventListener('click', () => {
  selectedOption = 'option-2';
  filterData();
  renderChart();
});

document.getElementById('option-3').addEventListener('click', () => {
  selectedOption = 'option-3';
  filterData();
  renderChart();
});

// Initialization
fetchData();