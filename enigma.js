//
//  Enigma.js
//
//  Algorithm used by the Enigma machine implemented in Javascript,
//  complete with choice of rotors, reflector (and respective settings)
//  and plugboard configuration.
//
//  Created by George Jensen on 20/06/2015.
//  Copyright (c) 2015 George Jensen. All rights reserved.
//

function Rotor(settings) {
		this.base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
		// inner is the letters that the outer part
		// of the rotor maps to
		this.inner = settings[0].split('');
		var offset = settings[1];
		this.turnover = settings[2][0];
		this.notch = settings[2][1];
		while (offset--) {
			this.rotate();
		}
		this.advance = false;

		this.rotate = function() {
			// remove first letter and put it on the end
			this.base.push(this.base.shift());
			this.inner.push(this.inner.shift());

			if (this.base[0] == this.turnover) {
				this.advance = true;
			}
		};

		// first pass through the rotor
		this.rightToLeft = function(index) {
		  return this.base.indexOf(this.inner[index]);
		};

		// second pass through the rotor
		this.leftToRight = function(index) {
		  return this.inner.indexOf(this.base[index]);
		};
}

function Reflector(wiring) {
	  this.base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	  this.inner = wiring.split('');

		// translates the input letter according to the wiring
		Reflector.prototype.translate = function(index) {
		  return this.inner.indexOf(this.base[index]);
		}
}

function Plugboard(wiring) {
		this.base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
		this.wiring = wiring;

		this.swap = function(index) {
			// if the giving letter is swapped in the plugboard
			// it's pair is returned, otherwise nothing happens to it
			if (this.base[index] in this.wiring) {
				return this.base.indexOf(this.wiring[this.base[index]]);
			} else {
				return index;
			}
		}
}
function Enigma(rotors, reflector, plugboard) {
		this.base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		this.rotors = rotors
		this.reflector = reflector
		this.plugboard = plugboard

		this.encipher = function(c) {
			// each key press causes the rotors to step
			this.rotors[0].rotate()

			// double step if notch has been reached
			if (this.rotors[1].base[0] == this.rotors[1].notch) {
				this.rotors[1].rotate()
			}

			// normal stepping
			for (i = 0; i < this.rotors.length; i++) {
				if (this.rotors[i].advance) {
					this.rotors[i].advance = false
					this.rotors[i + 1].rotate()
				}
			}
			// initially passes through plugboard
			index = this.plugboard.swap(this.base.indexOf(c))

			// first pass through each rotor
			for (i = 0; i < this.rotors.length; i++) {
				index = this.rotors[i].rightToLeft(index)
			}

			// translated by the reflector
			index = this.reflector.translate(index)

			// reverse pass through each rotor
			for (i = this.rotors.length - 1; i >= 0; i--) {
				index = this.rotors[i].leftToRight(index)
			}

			// finishes by passing through plugboard again
			c = this.base[this.plugboard.swap(index)]

			// change the previous 'lit up' letter back to white
			document.getElementById(previous).style.background = "#E0E0E0"
			// make new letter 'light up'
			document.getElementById(c).style.background = "#FFFF00"
			previous = c
			return c
		}
}

// keep track of previously pressed letter
var previous = 'A'

// choice of rotors
var I = new Rotor(["EKMFLGDQVZNTOWYHXUSPAIBRCJ", 0, ["R", "Q"]])
var II = new Rotor(["AJDKSIRUXBLHWTMCQGZNPYFVOE", 0, ["F", "E"]])
var III = new Rotor(["BDFHJLCPRTXVZNYEIWGAKMUSQO", 0, ["W", "V"]])
var IV = new Rotor(["ESOVPZJAYQUIRHXLNFTGKDCMWB", 0, ["K", "J"]])
var V = new Rotor(["VZBRGITYUPSDNHLXAWMJQOFECK", 0, ["A", "Z"]])
var VI = new Rotor(["JPGVOUMFYQBENHZRDKASXLICTW", 0, ["AN", "ZM"]])
var VII = new Rotor(["NZJHGRCXMYSWBOUFAIVLPEKQDT", 0, ["AN", "ZM"]])
var VIII = new Rotor(["FKQHTLXOCBJSPDZRAMEWNIUYGV", 0, ["AN", "ZM"]])

// choice of reflectors
var A = new Reflector("EJMZALYXVBWFCRQUONTSPIKHGD")
var B = new Reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT")
var C = new Reflector("FVPJIAOYEDRZXWGCTKUQSBNMHL")

// e.g. new Plugboard({"A": "B", "C": "D", etc...})
var plugboard = new Plugboard({})

var machine = new Enigma([III, II, I], B, plugboard)

window.addEventListener("keypress", checkKeyPressed, false);

function checkKeyPressed(e) {
  machine.encipher(String.fromCharCode(e.charCode).toUpperCase())
}
