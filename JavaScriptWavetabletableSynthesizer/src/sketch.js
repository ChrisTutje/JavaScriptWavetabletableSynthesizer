let osc;
let filter;
let waveformSelector;
let playButton;
let freqSlider;
let freqInput;
let filterSlider;
let filterLabel;
let playing = false;
let fft;

function setup() {
  createCanvas(400, 400);

  // Create an oscillator
  osc = new p5.Oscillator();

  // Create a low-pass filter
  filter = new p5.LowPass();

  // Connect the oscillator to the filter, and the filter to the output
  osc.disconnect();
  osc.connect(filter);

  // Create a dropdown menu for selecting the waveform
  waveformSelector = createSelect();
  waveformSelector.position(10, 10);
  waveformSelector.option('sine');
  waveformSelector.option('square');
  waveformSelector.option('triangle');
  waveformSelector.option('sawtooth');
  waveformSelector.changed(setWaveform);

  // Create a play/stop button
  playButton = createButton('Play');
  playButton.position(10, 40);
  playButton.mousePressed(togglePlay);

  // Create a slider for controlling the frequency
  freqSlider = createSlider(20, 20000, 440); // Frequency range from 20 Hz to 20,000 Hz
  freqSlider.position(10, 70);
  freqSlider.input(updateFrequency);

  // Create an input field for displaying and setting the frequency value
  freqInput = createInput('440');
  freqInput.position(180, 70);
  freqInput.size(50);
  freqInput.input(updateFrequencyFromInput);

  // Create a slider for controlling the filter frequency in percentage
  filterSlider = createSlider(0, 100, 100); // Percentage from 0% to 100%
  filterSlider.position(10, 100);
  filterSlider.input(updateFilterFrequency);

  // Create a label for the filter slider
  filterLabel = createDiv('Low-Pass Filter: 100%');
  filterLabel.position(220, 100);

  // Create FFT analyzer
  fft = new p5.FFT();
}

function draw() {
  background(220);

  // Analyze the sound and get the waveform
  let waveform = fft.waveform();

  // Draw the waveform
  noFill();
  beginShape();
  stroke(0);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
}

function setWaveform() {
  osc.setType(waveformSelector.value());
}

function togglePlay() {
  if (playing) {
    osc.stop();
    playButton.html('Play');
  } else {
    osc.start();
    osc.amp(0.5);  
    playButton.html('Stop');
  }
  playing = !playing;
}

function updateFrequency() {
  let freq = freqSlider.value();
  osc.freq(freq);
  freqInput.value(freq); // Update the input field to match the slider value
}

function updateFrequencyFromInput() {
  let freq = parseFloat(freqInput.value());
  if (!isNaN(freq) && freq >= 20 && freq <= 20000) { // Adjusted to match the slider range
    osc.freq(freq);
    freqSlider.value(freq); // Update the slider to match the input field value
  }
}

function updateFilterFrequency() {
  let percentage = filterSlider.value();
  let filterFreq = map(percentage, 0, 100, 10, 22050); // Map percentage to frequency range
  filter.freq(filterFreq);
  filterLabel.html('Low-Pass Filter: ' + percentage + '%'); // Update the label to show the percentage
}
