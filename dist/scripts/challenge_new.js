(function(r) {
	r.fn.qrcode = function(h) {
		var s;

		function u(a) {
			this.mode = s;
			this.data = a
		}

		function o(a, c) {
			this.typeNumber = a;
			this.errorCorrectLevel = c;
			this.modules = null;
			this.moduleCount = 0;
			this.dataCache = null;
			this.dataList = []
		}

		function q(a, c) {
			if(void 0 == a.length) throw Error(a.length + "/" + c);
			for(var d = 0; d < a.length && 0 == a[d];) d++;
			this.num = Array(a.length - d + c);
			for(var b = 0; b < a.length - d; b++) this.num[b] = a[b + d]
		}

		function p(a, c) {
			this.totalCount = a;
			this.dataCount = c
		}

		function t() {
			this.buffer = [];
			this.length = 0
		}
		u.prototype = {
			getLength: function() {
				return this.data.length
			},
			write: function(a) {
				for(var c = 0; c < this.data.length; c++) a.put(this.data.charCodeAt(c), 8)
			}
		};
		o.prototype = {
			addData: function(a) {
				this.dataList.push(new u(a));
				this.dataCache = null
			},
			isDark: function(a, c) {
				if(0 > a || this.moduleCount <= a || 0 > c || this.moduleCount <= c) throw Error(a + "," + c);
				return this.modules[a][c]
			},
			getModuleCount: function() {
				return this.moduleCount
			},
			make: function() {
				if(1 > this.typeNumber) {
					for(var a = 1, a = 1; 40 > a; a++) {
						for(var c = p.getRSBlocks(a, this.errorCorrectLevel), d = new t, b = 0, e = 0; e < c.length; e++) b += c[e].dataCount;
						for(e = 0; e < this.dataList.length; e++) c = this.dataList[e], d.put(c.mode, 4), d.put(c.getLength(), j.getLengthInBits(c.mode, a)), c.write(d);
						if(d.getLengthInBits() <= 8 * b) break
					}
					this.typeNumber = a
				}
				this.makeImpl(!1, this.getBestMaskPattern())
			},
			makeImpl: function(a, c) {
				this.moduleCount = 4 * this.typeNumber + 17;
				this.modules = Array(this.moduleCount);
				for(var d = 0; d < this.moduleCount; d++) {
					this.modules[d] = Array(this.moduleCount);
					for(var b = 0; b < this.moduleCount; b++) this.modules[d][b] = null
				}
				this.setupPositionProbePattern(0, 0);
				this.setupPositionProbePattern(this.moduleCount -
					7, 0);
				this.setupPositionProbePattern(0, this.moduleCount - 7);
				this.setupPositionAdjustPattern();
				this.setupTimingPattern();
				this.setupTypeInfo(a, c);
				7 <= this.typeNumber && this.setupTypeNumber(a);
				null == this.dataCache && (this.dataCache = o.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
				this.mapData(this.dataCache, c)
			},
			setupPositionProbePattern: function(a, c) {
				for(var d = -1; 7 >= d; d++)
					if(!(-1 >= a + d || this.moduleCount <= a + d))
						for(var b = -1; 7 >= b; b++) - 1 >= c + b || this.moduleCount <= c + b || (this.modules[a + d][c + b] =
							0 <= d && 6 >= d && (0 == b || 6 == b) || 0 <= b && 6 >= b && (0 == d || 6 == d) || 2 <= d && 4 >= d && 2 <= b && 4 >= b ? !0 : !1)
			},
			getBestMaskPattern: function() {
				for(var a = 0, c = 0, d = 0; 8 > d; d++) {
					this.makeImpl(!0, d);
					var b = j.getLostPoint(this);
					if(0 == d || a > b) a = b, c = d
				}
				return c
			},
			createMovieClip: function(a, c, d) {
				a = a.createEmptyMovieClip(c, d);
				this.make();
				for(c = 0; c < this.modules.length; c++)
					for(var d = 1 * c, b = 0; b < this.modules[c].length; b++) {
						var e = 1 * b;
						this.modules[c][b] && (a.beginFill(0, 100), a.moveTo(e, d), a.lineTo(e + 1, d), a.lineTo(e + 1, d + 1), a.lineTo(e, d + 1), a.endFill())
					}
				return a
			},
			setupTimingPattern: function() {
				for(var a = 8; a < this.moduleCount - 8; a++) null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
				for(a = 8; a < this.moduleCount - 8; a++) null == this.modules[6][a] && (this.modules[6][a] = 0 == a % 2)
			},
			setupPositionAdjustPattern: function() {
				for(var a = j.getPatternPosition(this.typeNumber), c = 0; c < a.length; c++)
					for(var d = 0; d < a.length; d++) {
						var b = a[c],
							e = a[d];
						if(null == this.modules[b][e])
							for(var f = -2; 2 >= f; f++)
								for(var i = -2; 2 >= i; i++) this.modules[b + f][e + i] = -2 == f || 2 == f || -2 == i || 2 == i || 0 == f && 0 == i ? !0 : !1
					}
			},
			setupTypeNumber: function(a) {
				for(var c =
						j.getBCHTypeNumber(this.typeNumber), d = 0; 18 > d; d++) {
					var b = !a && 1 == (c >> d & 1);
					this.modules[Math.floor(d / 3)][d % 3 + this.moduleCount - 8 - 3] = b
				}
				for(d = 0; 18 > d; d++) b = !a && 1 == (c >> d & 1), this.modules[d % 3 + this.moduleCount - 8 - 3][Math.floor(d / 3)] = b
			},
			setupTypeInfo: function(a, c) {
				for(var d = j.getBCHTypeInfo(this.errorCorrectLevel << 3 | c), b = 0; 15 > b; b++) {
					var e = !a && 1 == (d >> b & 1);
					6 > b ? this.modules[b][8] = e : 8 > b ? this.modules[b + 1][8] = e : this.modules[this.moduleCount - 15 + b][8] = e
				}
				for(b = 0; 15 > b; b++) e = !a && 1 == (d >> b & 1), 8 > b ? this.modules[8][this.moduleCount -
					b - 1
				] = e : 9 > b ? this.modules[8][15 - b - 1 + 1] = e : this.modules[8][15 - b - 1] = e;
				this.modules[this.moduleCount - 8][8] = !a
			},
			mapData: function(a, c) {
				for(var d = -1, b = this.moduleCount - 1, e = 7, f = 0, i = this.moduleCount - 1; 0 < i; i -= 2)
					for(6 == i && i--;;) {
						for(var g = 0; 2 > g; g++)
							if(null == this.modules[b][i - g]) {
								var n = !1;
								f < a.length && (n = 1 == (a[f] >>> e & 1));
								j.getMask(c, b, i - g) && (n = !n);
								this.modules[b][i - g] = n;
								e--; - 1 == e && (f++, e = 7)
							}
						b += d;
						if(0 > b || this.moduleCount <= b) {
							b -= d;
							d = -d;
							break
						}
					}
			}
		};
		o.PAD0 = 236;
		o.PAD1 = 17;
		o.createData = function(a, c, d) {
			for(var c = p.getRSBlocks(a,
					c), b = new t, e = 0; e < d.length; e++) {
				var f = d[e];
				b.put(f.mode, 4);
				b.put(f.getLength(), j.getLengthInBits(f.mode, a));
				f.write(b)
			}
			for(e = a = 0; e < c.length; e++) a += c[e].dataCount;
			if(b.getLengthInBits() > 8 * a) throw Error("code length overflow. (" + b.getLengthInBits() + ">" + 8 * a + ")");
			for(b.getLengthInBits() + 4 <= 8 * a && b.put(0, 4); 0 != b.getLengthInBits() % 8;) b.putBit(!1);
			for(; !(b.getLengthInBits() >= 8 * a);) {
				b.put(o.PAD0, 8);
				if(b.getLengthInBits() >= 8 * a) break;
				b.put(o.PAD1, 8)
			}
			return o.createBytes(b, c)
		};
		o.createBytes = function(a, c) {
			for(var d =
					0, b = 0, e = 0, f = Array(c.length), i = Array(c.length), g = 0; g < c.length; g++) {
				var n = c[g].dataCount,
					h = c[g].totalCount - n,
					b = Math.max(b, n),
					e = Math.max(e, h);
				f[g] = Array(n);
				for(var k = 0; k < f[g].length; k++) f[g][k] = 255 & a.buffer[k + d];
				d += n;
				k = j.getErrorCorrectPolynomial(h);
				n = (new q(f[g], k.getLength() - 1)).mod(k);
				i[g] = Array(k.getLength() - 1);
				for(k = 0; k < i[g].length; k++) h = k + n.getLength() - i[g].length, i[g][k] = 0 <= h ? n.get(h) : 0
			}
			for(k = g = 0; k < c.length; k++) g += c[k].totalCount;
			d = Array(g);
			for(k = n = 0; k < b; k++)
				for(g = 0; g < c.length; g++) k < f[g].length &&
					(d[n++] = f[g][k]);
			for(k = 0; k < e; k++)
				for(g = 0; g < c.length; g++) k < i[g].length && (d[n++] = i[g][k]);
			return d
		};
		s = 4;
		for(var j = {
				PATTERN_POSITION_TABLE: [
					[],
					[6, 18],
					[6, 22],
					[6, 26],
					[6, 30],
					[6, 34],
					[6, 22, 38],
					[6, 24, 42],
					[6, 26, 46],
					[6, 28, 50],
					[6, 30, 54],
					[6, 32, 58],
					[6, 34, 62],
					[6, 26, 46, 66],
					[6, 26, 48, 70],
					[6, 26, 50, 74],
					[6, 30, 54, 78],
					[6, 30, 56, 82],
					[6, 30, 58, 86],
					[6, 34, 62, 90],
					[6, 28, 50, 72, 94],
					[6, 26, 50, 74, 98],
					[6, 30, 54, 78, 102],
					[6, 28, 54, 80, 106],
					[6, 32, 58, 84, 110],
					[6, 30, 58, 86, 114],
					[6, 34, 62, 90, 118],
					[6, 26, 50, 74, 98, 122],
					[6, 30, 54, 78, 102, 126],
					[6, 26, 52,
						78, 104, 130
					],
					[6, 30, 56, 82, 108, 134],
					[6, 34, 60, 86, 112, 138],
					[6, 30, 58, 86, 114, 142],
					[6, 34, 62, 90, 118, 146],
					[6, 30, 54, 78, 102, 126, 150],
					[6, 24, 50, 76, 102, 128, 154],
					[6, 28, 54, 80, 106, 132, 158],
					[6, 32, 58, 84, 110, 136, 162],
					[6, 26, 54, 82, 110, 138, 166],
					[6, 30, 58, 86, 114, 142, 170]
				],
				G15: 1335,
				G18: 7973,
				G15_MASK: 21522,
				getBCHTypeInfo: function(a) {
					for(var c = a << 10; 0 <= j.getBCHDigit(c) - j.getBCHDigit(j.G15);) c ^= j.G15 << j.getBCHDigit(c) - j.getBCHDigit(j.G15);
					return(a << 10 | c) ^ j.G15_MASK
				},
				getBCHTypeNumber: function(a) {
					for(var c = a << 12; 0 <= j.getBCHDigit(c) -
						j.getBCHDigit(j.G18);) c ^= j.G18 << j.getBCHDigit(c) - j.getBCHDigit(j.G18);
					return a << 12 | c
				},
				getBCHDigit: function(a) {
					for(var c = 0; 0 != a;) c++, a >>>= 1;
					return c
				},
				getPatternPosition: function(a) {
					return j.PATTERN_POSITION_TABLE[a - 1]
				},
				getMask: function(a, c, d) {
					switch(a) {
						case 0:
							return 0 == (c + d) % 2;
						case 1:
							return 0 == c % 2;
						case 2:
							return 0 == d % 3;
						case 3:
							return 0 == (c + d) % 3;
						case 4:
							return 0 == (Math.floor(c / 2) + Math.floor(d / 3)) % 2;
						case 5:
							return 0 == c * d % 2 + c * d % 3;
						case 6:
							return 0 == (c * d % 2 + c * d % 3) % 2;
						case 7:
							return 0 == (c * d % 3 + (c + d) % 2) % 2;
						default:
							throw Error("bad maskPattern:" +
								a);
					}
				},
				getErrorCorrectPolynomial: function(a) {
					for(var c = new q([1], 0), d = 0; d < a; d++) c = c.multiply(new q([1, l.gexp(d)], 0));
					return c
				},
				getLengthInBits: function(a, c) {
					if(1 <= c && 10 > c) switch(a) {
						case 1:
							return 10;
						case 2:
							return 9;
						case s:
							return 8;
						case 8:
							return 8;
						default:
							throw Error("mode:" + a);
					} else if(27 > c) switch(a) {
						case 1:
							return 12;
						case 2:
							return 11;
						case s:
							return 16;
						case 8:
							return 10;
						default:
							throw Error("mode:" + a);
					} else if(41 > c) switch(a) {
						case 1:
							return 14;
						case 2:
							return 13;
						case s:
							return 16;
						case 8:
							return 12;
						default:
							throw Error("mode:" +
								a);
					} else throw Error("type:" + c);
				},
				getLostPoint: function(a) {
					for(var c = a.getModuleCount(), d = 0, b = 0; b < c; b++)
						for(var e = 0; e < c; e++) {
							for(var f = 0, i = a.isDark(b, e), g = -1; 1 >= g; g++)
								if(!(0 > b + g || c <= b + g))
									for(var h = -1; 1 >= h; h++) 0 > e + h || c <= e + h || 0 == g && 0 == h || i == a.isDark(b + g, e + h) && f++;
							5 < f && (d += 3 + f - 5)
						}
					for(b = 0; b < c - 1; b++)
						for(e = 0; e < c - 1; e++)
							if(f = 0, a.isDark(b, e) && f++, a.isDark(b + 1, e) && f++, a.isDark(b, e + 1) && f++, a.isDark(b + 1, e + 1) && f++, 0 == f || 4 == f) d += 3;
					for(b = 0; b < c; b++)
						for(e = 0; e < c - 6; e++) a.isDark(b, e) && !a.isDark(b, e + 1) && a.isDark(b, e +
							2) && a.isDark(b, e + 3) && a.isDark(b, e + 4) && !a.isDark(b, e + 5) && a.isDark(b, e + 6) && (d += 40);
					for(e = 0; e < c; e++)
						for(b = 0; b < c - 6; b++) a.isDark(b, e) && !a.isDark(b + 1, e) && a.isDark(b + 2, e) && a.isDark(b + 3, e) && a.isDark(b + 4, e) && !a.isDark(b + 5, e) && a.isDark(b + 6, e) && (d += 40);
					for(e = f = 0; e < c; e++)
						for(b = 0; b < c; b++) a.isDark(b, e) && f++;
					a = Math.abs(100 * f / c / c - 50) / 5;
					return d + 10 * a
				}
			}, l = {
				glog: function(a) {
					if(1 > a) throw Error("glog(" + a + ")");
					return l.LOG_TABLE[a]
				},
				gexp: function(a) {
					for(; 0 > a;) a += 255;
					for(; 256 <= a;) a -= 255;
					return l.EXP_TABLE[a]
				},
				EXP_TABLE: Array(256),
				LOG_TABLE: Array(256)
			}, m = 0; 8 > m; m++) l.EXP_TABLE[m] = 1 << m;
		for(m = 8; 256 > m; m++) l.EXP_TABLE[m] = l.EXP_TABLE[m - 4] ^ l.EXP_TABLE[m - 5] ^ l.EXP_TABLE[m - 6] ^ l.EXP_TABLE[m - 8];
		for(m = 0; 255 > m; m++) l.LOG_TABLE[l.EXP_TABLE[m]] = m;
		q.prototype = {
			get: function(a) {
				return this.num[a]
			},
			getLength: function() {
				return this.num.length
			},
			multiply: function(a) {
				for(var c = Array(this.getLength() + a.getLength() - 1), d = 0; d < this.getLength(); d++)
					for(var b = 0; b < a.getLength(); b++) c[d + b] ^= l.gexp(l.glog(this.get(d)) + l.glog(a.get(b)));
				return new q(c, 0)
			},
			mod: function(a) {
				if(0 >
					this.getLength() - a.getLength()) return this;
				for(var c = l.glog(this.get(0)) - l.glog(a.get(0)), d = Array(this.getLength()), b = 0; b < this.getLength(); b++) d[b] = this.get(b);
				for(b = 0; b < a.getLength(); b++) d[b] ^= l.gexp(l.glog(a.get(b)) + c);
				return(new q(d, 0)).mod(a)
			}
		};
		p.RS_BLOCK_TABLE = [
			[1, 26, 19],
			[1, 26, 16],
			[1, 26, 13],
			[1, 26, 9],
			[1, 44, 34],
			[1, 44, 28],
			[1, 44, 22],
			[1, 44, 16],
			[1, 70, 55],
			[1, 70, 44],
			[2, 35, 17],
			[2, 35, 13],
			[1, 100, 80],
			[2, 50, 32],
			[2, 50, 24],
			[4, 25, 9],
			[1, 134, 108],
			[2, 67, 43],
			[2, 33, 15, 2, 34, 16],
			[2, 33, 11, 2, 34, 12],
			[2, 86, 68],
			[4, 43, 27],
			[4, 43, 19],
			[4, 43, 15],
			[2, 98, 78],
			[4, 49, 31],
			[2, 32, 14, 4, 33, 15],
			[4, 39, 13, 1, 40, 14],
			[2, 121, 97],
			[2, 60, 38, 2, 61, 39],
			[4, 40, 18, 2, 41, 19],
			[4, 40, 14, 2, 41, 15],
			[2, 146, 116],
			[3, 58, 36, 2, 59, 37],
			[4, 36, 16, 4, 37, 17],
			[4, 36, 12, 4, 37, 13],
			[2, 86, 68, 2, 87, 69],
			[4, 69, 43, 1, 70, 44],
			[6, 43, 19, 2, 44, 20],
			[6, 43, 15, 2, 44, 16],
			[4, 101, 81],
			[1, 80, 50, 4, 81, 51],
			[4, 50, 22, 4, 51, 23],
			[3, 36, 12, 8, 37, 13],
			[2, 116, 92, 2, 117, 93],
			[6, 58, 36, 2, 59, 37],
			[4, 46, 20, 6, 47, 21],
			[7, 42, 14, 4, 43, 15],
			[4, 133, 107],
			[8, 59, 37, 1, 60, 38],
			[8, 44, 20, 4, 45, 21],
			[12, 33, 11, 4, 34, 12],
			[3, 145, 115, 1, 146,
				116
			],
			[4, 64, 40, 5, 65, 41],
			[11, 36, 16, 5, 37, 17],
			[11, 36, 12, 5, 37, 13],
			[5, 109, 87, 1, 110, 88],
			[5, 65, 41, 5, 66, 42],
			[5, 54, 24, 7, 55, 25],
			[11, 36, 12],
			[5, 122, 98, 1, 123, 99],
			[7, 73, 45, 3, 74, 46],
			[15, 43, 19, 2, 44, 20],
			[3, 45, 15, 13, 46, 16],
			[1, 135, 107, 5, 136, 108],
			[10, 74, 46, 1, 75, 47],
			[1, 50, 22, 15, 51, 23],
			[2, 42, 14, 17, 43, 15],
			[5, 150, 120, 1, 151, 121],
			[9, 69, 43, 4, 70, 44],
			[17, 50, 22, 1, 51, 23],
			[2, 42, 14, 19, 43, 15],
			[3, 141, 113, 4, 142, 114],
			[3, 70, 44, 11, 71, 45],
			[17, 47, 21, 4, 48, 22],
			[9, 39, 13, 16, 40, 14],
			[3, 135, 107, 5, 136, 108],
			[3, 67, 41, 13, 68, 42],
			[15, 54, 24, 5, 55, 25],
			[15,
				43, 15, 10, 44, 16
			],
			[4, 144, 116, 4, 145, 117],
			[17, 68, 42],
			[17, 50, 22, 6, 51, 23],
			[19, 46, 16, 6, 47, 17],
			[2, 139, 111, 7, 140, 112],
			[17, 74, 46],
			[7, 54, 24, 16, 55, 25],
			[34, 37, 13],
			[4, 151, 121, 5, 152, 122],
			[4, 75, 47, 14, 76, 48],
			[11, 54, 24, 14, 55, 25],
			[16, 45, 15, 14, 46, 16],
			[6, 147, 117, 4, 148, 118],
			[6, 73, 45, 14, 74, 46],
			[11, 54, 24, 16, 55, 25],
			[30, 46, 16, 2, 47, 17],
			[8, 132, 106, 4, 133, 107],
			[8, 75, 47, 13, 76, 48],
			[7, 54, 24, 22, 55, 25],
			[22, 45, 15, 13, 46, 16],
			[10, 142, 114, 2, 143, 115],
			[19, 74, 46, 4, 75, 47],
			[28, 50, 22, 6, 51, 23],
			[33, 46, 16, 4, 47, 17],
			[8, 152, 122, 4, 153, 123],
			[22, 73, 45,
				3, 74, 46
			],
			[8, 53, 23, 26, 54, 24],
			[12, 45, 15, 28, 46, 16],
			[3, 147, 117, 10, 148, 118],
			[3, 73, 45, 23, 74, 46],
			[4, 54, 24, 31, 55, 25],
			[11, 45, 15, 31, 46, 16],
			[7, 146, 116, 7, 147, 117],
			[21, 73, 45, 7, 74, 46],
			[1, 53, 23, 37, 54, 24],
			[19, 45, 15, 26, 46, 16],
			[5, 145, 115, 10, 146, 116],
			[19, 75, 47, 10, 76, 48],
			[15, 54, 24, 25, 55, 25],
			[23, 45, 15, 25, 46, 16],
			[13, 145, 115, 3, 146, 116],
			[2, 74, 46, 29, 75, 47],
			[42, 54, 24, 1, 55, 25],
			[23, 45, 15, 28, 46, 16],
			[17, 145, 115],
			[10, 74, 46, 23, 75, 47],
			[10, 54, 24, 35, 55, 25],
			[19, 45, 15, 35, 46, 16],
			[17, 145, 115, 1, 146, 116],
			[14, 74, 46, 21, 75, 47],
			[29, 54, 24, 19,
				55, 25
			],
			[11, 45, 15, 46, 46, 16],
			[13, 145, 115, 6, 146, 116],
			[14, 74, 46, 23, 75, 47],
			[44, 54, 24, 7, 55, 25],
			[59, 46, 16, 1, 47, 17],
			[12, 151, 121, 7, 152, 122],
			[12, 75, 47, 26, 76, 48],
			[39, 54, 24, 14, 55, 25],
			[22, 45, 15, 41, 46, 16],
			[6, 151, 121, 14, 152, 122],
			[6, 75, 47, 34, 76, 48],
			[46, 54, 24, 10, 55, 25],
			[2, 45, 15, 64, 46, 16],
			[17, 152, 122, 4, 153, 123],
			[29, 74, 46, 14, 75, 47],
			[49, 54, 24, 10, 55, 25],
			[24, 45, 15, 46, 46, 16],
			[4, 152, 122, 18, 153, 123],
			[13, 74, 46, 32, 75, 47],
			[48, 54, 24, 14, 55, 25],
			[42, 45, 15, 32, 46, 16],
			[20, 147, 117, 4, 148, 118],
			[40, 75, 47, 7, 76, 48],
			[43, 54, 24, 22, 55, 25],
			[10,
				45, 15, 67, 46, 16
			],
			[19, 148, 118, 6, 149, 119],
			[18, 75, 47, 31, 76, 48],
			[34, 54, 24, 34, 55, 25],
			[20, 45, 15, 61, 46, 16]
		];
		p.getRSBlocks = function(a, c) {
			var d = p.getRsBlockTable(a, c);
			if(void 0 == d) throw Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + c);
			for(var b = d.length / 3, e = [], f = 0; f < b; f++)
				for(var h = d[3 * f + 0], g = d[3 * f + 1], j = d[3 * f + 2], l = 0; l < h; l++) e.push(new p(g, j));
			return e
		};
		p.getRsBlockTable = function(a, c) {
			switch(c) {
				case 1:
					return p.RS_BLOCK_TABLE[4 * (a - 1) + 0];
				case 0:
					return p.RS_BLOCK_TABLE[4 * (a - 1) + 1];
				case 3:
					return p.RS_BLOCK_TABLE[4 *
						(a - 1) + 2];
				case 2:
					return p.RS_BLOCK_TABLE[4 * (a - 1) + 3]
			}
		};
		t.prototype = {
			get: function(a) {
				return 1 == (this.buffer[Math.floor(a / 8)] >>> 7 - a % 8 & 1)
			},
			put: function(a, c) {
				for(var d = 0; d < c; d++) this.putBit(1 == (a >>> c - d - 1 & 1))
			},
			getLengthInBits: function() {
				return this.length
			},
			putBit: function(a) {
				var c = Math.floor(this.length / 8);
				this.buffer.length <= c && this.buffer.push(0);
				a && (this.buffer[c] |= 128 >>> this.length % 8);
				this.length++
			}
		};
		"string" === typeof h && (h = {
			text: h
		});
		h = r.extend({}, {
			render: "canvas",
			width: 256,
			height: 256,
			typeNumber: -1,
			correctLevel: 2,
			background: "#ffffff",
			foreground: "#000000"
		}, h);
		return this.each(function() {
			var a;
			if("canvas" == h.render) {
				a = new o(h.typeNumber, h.correctLevel);
				a.addData(h.text);
				a.make();
				var c = document.createElement("canvas");
				c.width = h.width;
				c.height = h.height;
				for(var d = c.getContext("2d"), b = h.width / a.getModuleCount(), e = h.height / a.getModuleCount(), f = 0; f < a.getModuleCount(); f++)
					for(var i = 0; i < a.getModuleCount(); i++) {
						d.fillStyle = a.isDark(f, i) ? h.foreground : h.background;
						var g = Math.ceil((i + 1) * b) - Math.floor(i * b),
							j = Math.ceil((f + 1) * b) - Math.floor(f * b);
						d.fillRect(Math.round(i * b), Math.round(f * e), g, j)
					}
			} else {
				a = new o(h.typeNumber, h.correctLevel);
				a.addData(h.text);
				a.make();
				c = r("<table></table>").css("width", h.width + "px").css("height", h.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", h.background);
				d = h.width / a.getModuleCount();
				b = h.height / a.getModuleCount();
				for(e = 0; e < a.getModuleCount(); e++) {
					f = r("<tr></tr>").css("height", b + "px").appendTo(c);
					for(i = 0; i < a.getModuleCount(); i++) r("<td></td>").css("width",
						d + "px").css("background-color", a.isDark(e, i) ? h.foreground : h.background).appendTo(f)
				}
			}
			a = c;
			jQuery(a).appendTo(this)
		})
	}
	
	
	var lastTime = 0;  
    var vendors = ['ms', 'moz', 'webkit', 'o'];  
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {  
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];  
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']   
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];  
    }  
   
    if (!window.requestAnimationFrame)  
        window.requestAnimationFrame = function(callback, element) {  
            var currTime = new Date().getTime();  
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));  
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },   
              timeToCall);  
            lastTime = currTime + timeToCall;  
            return id;  
        };  
   
    if (!window.cancelAnimationFrame)  
        window.cancelAnimationFrame = function(id) {  
            clearTimeout(id);  
        };
})(jQuery);

//minxing tip extend
(function($) {
	$.fn.tip = function(opt) {
		opt = opt || {};
		var this_ = $(this);
		var options = $.extend({}, $.fn.tip.options, opt);
		if(this_.find('.tip_box').length != 0) {
			return;
		}

		var tipJq = $("<div class='tip_box'></div>");
		init(options);

		this_.hover(function() {
			$(this).find('.tip_box').show();
		}, function() {
			$(this).find('.tip_box').hide();
		})

		function init(opt) {
			var browerV = myBrowser();
			var targetWidth = this_.width() || 20;
			var targetHeight = this_.height() || 20;
			opt.boxTop = opt.boxTop || targetWidth - 5;
			if("8.0" == browerV) {
				tipJq.html(opt.tipContent);
				tipJq.appendTo(this_);
				tipJq.css({
					'width': opt.boxWidth,
					'height': opt.boxHeight,
					'left': opt.boxLeft,
					'top': opt.boxTop,
					'font-size': opt.fontSize,
					'color': opt.color,
				})
				tipJq.append("<img id='tip_pic' class='tip_pic_" + opt.tipPos + "' src='../static/img/jiao.png'>")
			} else {
				if(opt.tipPos == 'left') {
					opt.boxLeft = opt.boxLeft || -targetWidth;
				} else if(opt.tipPos == 'center') {
					opt.boxLeft = opt.boxLeft || -opt.boxWidth / 2;
				} else if(opt.tipPos == 'right') {
					opt.boxLeft = opt.boxLeft || -opt.boxWidth;
				}
				tipJq.html(opt.tipContent);
				tipJq.appendTo(this_);
				tipJq.css({
						'width': opt.boxWidth,
						'height': opt.boxHeight,
						'left': opt.boxLeft,
						'top': opt.boxTop,
						'font-size': opt.fontSize,
						'color': opt.color,
					})
					.addClass('tip_box_' + opt.tipPos);
			}

		}
	}

	$.fn.tip.options = {
		tipPos: 'left', //浮层小箭头的位置
		boxWidth: 300, //浮层的宽度
		boxHeight: 'auto',
		boxLeft: 50, //浮层距离父级提示按钮的绝对定位left
		boxTop: 0, //浮层距离父级提示按钮的绝对定位top
		fontSize: 12, //浮层中字体大小
		tipContent: "test", //浮层中内容
		color: "#aadbed" //浮层中字体颜色
	}

	function myBrowser() {
		var DEFAULT_VERSION = "8.0";
		var ua = navigator.userAgent.toLowerCase();
		var isIE = ua.indexOf("msie") > -1;
		var safariVersion;
		if(isIE) safariVersion = ua.match(/msie ([\d.]+)/)[1];
		return safariVersion;
	}
})(jQuery)
var interval = 1000;

//数据交互
var detailObj = function(){
	var options = {
		hostUrl : "",
		barId : 1111,
		playerAccount : 254332471,
		challengeMatchId : 10,
		needShowRecord : "",
		needShowRules : "",
		matchType : "",
		payObj : {
			timeNum : 300,//倒计时时间
			timeQuery:"",//轮训查询支付
			timeBack:"",//轮训倒计时
			orderId:"",//订单id
			challengeLevelId:""//场次id
		},
		challengeStatus:{
			isLogin : "",//用户是否已登录
			matchType : "",//挑战赛类型
			allowTeam : "",//是否允许组队
			limitMinute : "",//时间限制
			levelLimit : "",//等级限制（0：无限制；30:满30级）
			rankRemark : ""//段位限制
		},
		haoTime :"",
		haoFlag : true,
		ajaxTimeout:3000,
		needRefresh:false
	}
	var this_ = this;
	var timeBackInte = "";
	
	var urlList = {
		url_getUserInfo : function() {
			return options.hostUrl + "challenge/getChallengePlayerInfo?challengeMatchId=" + options.challengeMatchId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
	
		url_getChallengeLevelInfo : function() {
			return options.hostUrl + "challenge/getChallengeLevelInfo?challengeMatchId=" + options.challengeMatchId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
	
		url_listChallengeRecords : function(pageNo, pageSize) {
			return options.hostUrl + "challenge/listChallengeRecords?pageNo=" + pageNo +
				"&pageSize=" + pageSize +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
	
		url_listChallengeRoomPlayers : function(pageNo, pageSize, challengeRoomId) {
			return options.hostUrl + "challenge/listChallengeRoomPlayers?pageNo=" + pageNo +
				"&pageSize=" + pageSize +
				"&challengeRoomId=" + challengeRoomId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
		url_challenge : function(challengeLevelId) {
			return options.hostUrl + "challengeApply/challenge?barId=" + options.barId +
				"&challengeLevelId=" + challengeLevelId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL);
		},
	
		url_enterRoom : function(challengeLevelId,orderId) {
			return options.hostUrl + "challengeApply/enterRoom?challengeLevelId=" + challengeLevelId +
				"&playerAccount=" + ClientAPI.getSubAccount(GameID.LOL)+
				"&barId=" + options.barId+
				"&orderId=" + (orderId || "");
		},
		
		url_payFinished : function(orderId) {
			return options.hostUrl + "recharge/payFinished?orderId=" + orderId;
		},
		
		url_queryChallengeMatchState : function() {
			return options.hostUrl + "challenge/queryChallengeMatchState?challengeMatchId=" + options.challengeMatchId;
		},
		
		url_getAllChallengeMatchInfo : function() {
			return options.hostUrl + "challenge/getAllChallengeMatchInfo";
		},
		
		//重新跳转对应的挑战赛
		url_index : function(challengeMatchId) {
			return options.hostUrl + "challenge/index?challengeMatchId=" + challengeMatchId;
		}
	}
	
	//初始化方法
	this.init = function(options_) {
		options = $.extend({}, options, options_);
	}
	
	this.eventElement = function() {
		$('.remind_ball1').on('mousedown', function() {
			if(!alertFlag1) $(this).css('background-position', '0 240px')
		})
		$('.remind_ball1').hover(function() {
			if(!alertFlag1) $(this).css('background-position', '0 160px')
		}, function() {
			if(alertFlag1) {
				$(this).css('background-position', '0 80px');
			} else {
				$(this).css('background-position', '0 0');
			}
		})
		$('.remind_ball1').on('mouseup', function() {
			if(!alertFlag1) $(this).css('background-position', '0 160px')
		})
		
		$('.remind_ball2').on('mousedown', function() {
			if(!alertFlag2) $(this).css('background-position', '0 240px')
		})
		$('.remind_ball2').hover(function() {
			if(!alertFlag2) $(this).css('background-position', '0 160px')
		}, function() {
			if(alertFlag2) {
				$(this).css('background-position', '0 80px');
			} else {
				$(this).css('background-position', '0 0');
			}
		})
		$('.remind_ball2').on('mouseup', function() {
			if(!alertFlag2) $(this).css('background-position', '0 160px')
		})
		
		$('.alert_button').on('mousedown', function() {
			$(this).css('background-position', '0 70px');
		})
		$('.alert_button').hover(function() {
			$(this).css('background-position', '0 140px');
		}, function() {
			$(this).css('background-position', '0 0')
		})
		$('.alert_button').on('mouseup', function() {
			$(this).css('background-position', '0 140px');
		})
		$('.alert_button').on('click', function() {
			$('.alert_box').animate({
				'bottom': '-413px'
			}, 150);
			$('.ball').css('background-position', '0 0');
			alertFlag1 = false;
			alertFlag2 = false;
		})
		var alertFlag1 = false,
			alertFlag2 = false;
		//点击挑战纪录
		$('.remind_num, .remind_ball1').on('click', function() {
			if(!alertFlag1) {
				do_challengeValidate(true, options.challengeMatchId, options.challengeStatus.levelLimit, options.challengeStatus.rankRemark,function() {
					this_.getChallengeList();
					alertFlag1 = true;
					$('.alert_box').animate({
						'bottom': '0px'
					}, 150);
					$('.rule_content').hide();
					$('.box_challenge').show();
					$('.remind_ball2').css('background-position', '0 0');
					alertFlag2 = false;
				});
			}
			
		})
		
		$('.remind_ball2').on('click', function() {
			alertFlag2 = true;
			$('.alert_box').animate({
				'bottom': '0px'
			}, 150);
			$('.rule_content').show();
			$('.box_challenge').hide();
			$('.remind_ball1').css('background-position', '0 0');
			alertFlag1 = false;
		})
		
		$('.remind').tip({
			tipContent: '玩家的游戏能力评分，会根据挑战结果变化',
			fontSize: 12,
			boxLeft: -165,
			boxTop: 40,
			boxWidth: 215,
			tipPos: 'right'
		})
		
		//二维码支付关闭后停止查询
		$('#alert_qrcode').on('hidden.bs.modal', function () {
			closeQrcode();
		});
		
		//绑定顺豆支付确定事件
		$('#alert_shunpay .btn_sure').on('click',function() {
			$('#alert_shunpay').modal('hide');
			this_.do_enterRoom(options.payObj.challengeLevelId);
		})
		
		//绑定进入房间确认按钮事件
		$('#alert_enter .btn_sure').on('click',function() {
			$('#alert_enter').modal('hide');
			//进入游戏
			startGame();
		})
		
		//绑定刷新按钮
		$('.opt_refresh').on('click',function(e) {
			if(options.needRefresh) {
				location.reload();
			} else {
				clearInterval(timeBackInte);
				this_.do_etChallengeLevelInfo();
				this_.getUserInfo();
			}
		})
		
		//左边导航点击切换
		$('.left_main_menu ul li').on('click', function(data) {
			$(this).siblings('li').removeClass('active');
			$(this).addClass('active');
			var hrefStr = $(this).attr('data-href');
			      location.href=hrefStr;
		});
		
		//左边导航点击切换
		$('.menu-wrap ul li').on('click', function(data) {
			if(!$(this).hasClass('active')) this_.do_getAllChallengeMatchInfo();
		});
	}
	
	var ShowCountDown = function(date, divname) {
		var now = new Date();
		var endDate = new Date(date);
		var leftTime = endDate.getTime() - now.getTime();
		var leftsecond = parseInt(leftTime / 1000);
		var day1 = Math.floor(leftsecond / (60 * 60 * 24));
		var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
		hour = hour < 10 ? "0" + hour : hour;
		var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
		minute = minute < 10 ? "0" + minute : minute;
		var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
		second = second < 10 ? "0" + second : second;
		var cc = $(divname);
		cc.html(hour + ":" + minute + ":" + second);
		
		//倒计时结束后处理业务
		if(endDate<= now) {
			if(options.needRefresh) {
				location.reload();
			} else {
				clearInterval(timeBackInte);
				this_.do_etChallengeLevelInfo();
				this_.getUserInfo();
			}
			return;
		}
	}
	
	var countBack = function(date, targetName) {
		timeBackInte = setInterval(function() {
			ShowCountDown(date, targetName);
		}, interval);
	}
	
	var showTipNum = function(num) {
		$('.remind_num').html("+" + num).show();
	}
	
	//设置图片 init
	this.setTitle = function() {
		if(options.matchType == 1) {
			$('.challenge_title').attr('src', 'images/ten_title.png');
			$('.detail_box').css('background', 'url(images/challenge_bg_new.jpg) 120px 0px');
		} else if(options.matchType == 2) {
			$('.challenge_title').attr('src', 'images/hunderd_title.png');
			$('.detail_box').css('background', 'url(images/challenge_bg_new2.jpg) 120px 0px');
		}
		$('.challenge_lol').removeClass('hide');
		$('.challenge_title').removeClass('hide');
		$('.title_stone').removeClass('hide');
		$('.menu-wrap li').removeClass("active");
		$('.menu-wrap .li_'+options.matchType).addClass("active");
	}
	
	//设置挑战纪录
	this.showChallengeRulesList = function() {
		if(options.needShowRecord == 1) {
			$('.remind_num, .remind_ball1').click();
		} else if(options.needShowRules == 1) {
			$('.remind_ball2').click();
		}
	}
	
	//关闭二维码框处理事件
	var closeQrcode = function() {
		$('#alert_qrcode').modal('hide');
		clearInterval(options.payObj.timeQuery);
		clearTimeout(options.payObj.timeBack);
		$('.qrcode_status .status_time').html("");
		$('.qrcode_status .status_hao').html("");
		options.haoFlag = false;
		$('.qrcode_status .status_hao').html("");
		options.payObj.timeNum = 300;
	}
	//进入竞技场弹窗
	var alert_enter = function(obj) {
		$('#alert_enter').modal();
		if("SwBean" == obj.applyWay) {
			$('#alert_enter .alert_title_h2 span').html(obj.swbean+"<img src='images/SD.png' style='width: 20px;margin-top: -2px;margin-left: 2px;'>");
		} else if("Qrcode" == obj.applyWay) {
			$('#alert_enter .alert_title_h2 span').html(obj.money);
		}
		$('#alert_enter .alert_title_h1 span').html(obj.roomId);
		$('#alert_enter .alert_title_h3').html("*请仔细阅读挑战规则，并在"+obj.limitMinute+"分钟内完成一场比赛");
		$('#alert_enter .gameType').html(obj.gameType);
		$('#alert_enter .allowTeam').html(obj.allowTeam?"是":"否");
		//同时刷新挑战列表
		this_.do_etChallengeLevelInfo();
	}
	
	//顺豆支付弹框
	var alert_shunpay_show = function(obj) {
		$('#alert_shunpay').modal();
		$('#alert_shunpay .alert_title_h2').html("本场报名费：" + obj.swbean + "顺豆");
		$('#alert_shunpay .alert_title_h3').html("*请仔细阅读挑战规则，并在"+obj.limitMinute+"分钟内完成一场比赛");
		$('#alert_shunpay .gameType').html(obj.gameType);
		$('#alert_shunpay .allowTeam').html(obj.allowTeam?"是":"否");
	}
	
	var addBox = function(num) {
		if(!options.haoFlag) return;
		num--;
		if(num < 0) num = 60;
		var num_ = num<10?(":0"+num):(":"+num);
		$('.qrcode_status .status_hao').html(num_);
		window.requestAnimationFrame(function() {
			if(options.haoFlag) addBox(num);
		});
	}
	
	var alertMsg = function(msg) {
		$('#alert_msg .alert_title_h1').html(msg);
		$('#alert_msg').modal();
	}
	
	var errorMsg = function(msg) {
		$('#alert_msg .alert_title_h1').html(msg);
		$('#alert_msg').modal();
	}
	//扫码或者顺豆支付弹窗
	var alert_applyWay = function(obj) {
		if('Qrcode' == obj.applyWay) {
			$('#alert_qrcode').modal();
			$('#alert_qrcode .alert_title_h2').html("本场报名费：" + obj.money + " / " + obj.swbean + "顺豆");
			$("#alert_qrcode .alert_img_qrcode").empty().qrcode({
				width: 120,
				height: 120,
				text: obj.qrcodeUrl
			});
			
			$('#alert_qrcode .alert_title_h3').html("*请仔细阅读挑战规则，并在"+obj.limitMinute+"分钟内完成一场比赛");
			$('#alert_qrcode .gameType').html(obj.gameType);
			$('#alert_qrcode .allowTeam').html(obj.allowTeam?"是":"否");
			
			$('.qrcode_status .status_time').html("剩余支付时间：05:00");
			options.haoFlag = true;
			addBox(60);
			options.payObj.orderId = obj.orderId;
			qrcodeTimeBack();
			//轮训查询支付状态
			options.payObj.timeQuery = setInterval(function() {
				this_.do_payFinished();
			},7000);
		} else if('SwBean' == obj.applyWay) {
			//顺豆支付弹框
			alert_shunpay_show(obj);
		}
	}
	//扫码倒计时
	var qrcodeTimeBack = function() {
		options.payObj.timeNum--;
		var time_ = "0"+parseInt(options.payObj.timeNum/60)+":"+((options.payObj.timeNum%60)<10?("0"+options.payObj.timeNum%60):options.payObj.timeNum%60);
		options.payObj.timeBack = setTimeout(function() {
			if(options.payObj.timeNum <= 0) {
				closeQrcode();
				return;
			}
			if(options.payObj.timeNum <= 4) {
				$('.qrcode_status .status_time').html("支付失败,将于3秒后关闭，请重新进入");
				options.haoFlag = false;
				$('.qrcode_status .status_hao').html("");
			} else {
				$('.qrcode_status .status_time').html("剩余支付时间："+time_);
			}
			qrcodeTimeBack();
		},1000);
	}
	
	//挑战纪录
	this.getChallengeList = function() {
		$('#tab_challenge').bootstrapTable('destroy'); 
		$('#tab_challenge').bootstrapTable({
			method: 'post',
			striped: true, //是否显示行间隔色
			height: 400,
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			paginationLoop: false,
			showPageDetail: false,
			paginationHAlign: 'center',
			sortable: false, //是否启用排序
			sortOrder: "asc", //排序方式
			pageNo: 1, //初始化加载第一页，默认第一页
			pageSize: 10, //每页的记录行数（*）
			url: options.hostUrl+"challenge/listChallengeRecords?playerAccount="+ClientAPI.getSubAccount(GameID.LOL), //这个接口需要处理bootstrap table传递的固定参数
			queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
			queryParams: queryParamsChallenge, //前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			minimumCountColumns: 1, //最少允许的列数
			clickToSelect: true, //是否启用点击选中行
			searchOnEnterKey: true,
			columns: [{
				field: 'challengeRoomId',
				title: '场次',
				align: 'center',
				width: '10%'
			}, {
				field: 'challengeDateTime',
				title: '时间',
				align: 'center',
				width: '20%',
				formatter: function(value, row, index) {
					return "<span style='color:#6291ad'>" + value + "</span>";
				}
			}, {
				field: 'challengeType',
				title: '类型',
				align: 'center',
				width: '15%',
				formatter: function(value, row, index) {
					return "<span style='color:#6291ad'>" + value + "</span>";
				}
			}, {
				field: 'serverName',
				title: '角色名/所在服务器',
				align: 'center',
				width: '20%',
				formatter: function(value, row, index) {
					return "<span style='color:#6291ad'>" + value + "</span>";
				}
			},{
				
				field: 'score',
				title: '我的评分',
				align: 'center',
				width: '10%'
			},{
				field: 'rank',
				title: '我的成绩',
				align: 'center',
				width: '15%',
				formatter: function(value, row, index) {
					if(value.indexOf("成功") != -1) {
						return "<span style='color:#ee9f03'>" + value + "</span>";
					} else {
						return value;
					}
		
				}
			}, {
				field: 'finished',
				title: '详情',
				align: 'center',
				width: '10%',
				formatter: function(value, row, index) {
					if(value) {
						return "<div onclick='checkRoom(" + JSON.stringify(row) + ")' style='cursor:pointer; color:#00aeff'>查看</div>";
					} else {
						return "<div style='cursor:pointer; color:#3a515c'>查看</div>";
					}
		
				}
			}]
		});
		
		function queryParamsChallenge(params) {
			return {
				pageSize: params.pageSize,
				pageNo: params.pageNo
			};
		}
	}
	
	//传递房间号调用房间列表
	this.checkRoom = function(row) {
		if(row) this_.initRoomTab(row.challengeRoomId, row.challengeType);
	}
	
	//查看详情
	this.initRoomTab = function(challengeRoomId, challengeType) {
		$('#tab_rooms').bootstrapTable('destroy'); 
		$('#tab_rooms').bootstrapTable({
			method: 'post',
			striped: true, //是否显示行间隔色
			height: 500,
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			paginationLoop: false,
			showPageDetail: false,
			paginationHAlign: 'center',
			sortable: false, //是否启用排序
			sortOrder: "asc", //排序方式
			pageNo: 1, //初始化加载第一页，默认第一页
			pageSize: 10, //每页的记录行数（*）
			url: options.hostUrl+"challenge/listChallengeRoomPlayers?challengeRoomId=" + challengeRoomId + "&playerAccount="+ClientAPI.getSubAccount(GameID.LOL), //这个接口需要处理bootstrap table传递的固定参数
			queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
			queryParams: queryParamsRoom, //前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			minimumCountColumns: 1, //最少允许的列数
			clickToSelect: true, //是否启用点击选中行
			searchOnEnterKey: true,
			columns: [{
				field: 'rank',
				title: '排名',
				align: 'center',
				width:"10%",
				formatter: function(value, row, index) {
					if(value) {
						return "<span style='color:#9c9e9f'>" + value + "</span>";
					} else {
						return "-";
					}
				}
			}, {
				field: 'playerName',
				title: '角色名',
				align: 'center',
				width:"20%",
				formatter: function(value, row, index) {
					if(value) {
						return "<span style='color:#9c9e9f'>" + value + "</span>";
					} else {
						return "-";
					}
				}
			}, {
				field: 'serverName',
				title: '所在区服',
				align: 'center',
				width:"20%",
				formatter: function(value, row, index) {
					if(value) {
						return value;
					} else {
						return "-"	
					}
				}
			}, {
				field: 'challengeState',
				title: '挑战状态',
				align: 'center',
				width:"15%",
				formatter: function(value, row, index) {
					if(value) {
						return value;
					} else {
						return "-"	
					}
				}
			}, {
				field: 'challengeFinishDateTime',
				title: '完成挑战时间',
				align: 'center',
				width:"25%",
				formatter: function(value, row, index) {
					if(value) {
						return value;
					} else {
						return "-"	
					}
				}
			}, {
				field: 'score',
				title: '评分',
				align: 'center',
				width:"10%",
				formatter: function(value, row, index) {
					if(value) {
						return "<div style='color:#b55e0b'>" + (value.indexOf("超时") == -1?value:0) + "</div>";
					} else {
						return "-";
					}
				}
			}],
			rowStyle: function rowStyle(row, index) {
				if(row.self) {
					return {
						css: {
							"background": '#0f2a30',
							'color': '#9c9e9f'
						}
					}
				} else {
					return {}
				}
			}
		});
	
		function queryParamsRoom(params) {
			return {
				pageSize: params.pageSize,
				pageNo: params.pageNo
			};
		}
		$('#alert_ten .alert_title_h4').html("场次id:" + challengeRoomId);
		$('#alert_ten .alert_title_h1').html(challengeType);
		$('#alert_ten').modal();
	}
	
	//获取用户信息
	this.getUserInfo = function() {
		//判断是否登录。如果未登录则不查询
		if(!ClientAPI.getSubAccount(GameID.LOL)) return;
		$.ajax({
			type: 'POST',
			url: urlList.url_getUserInfo(),
			dataType: 'json',
			timeout: options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'],
						playName = data['playName'],
						serverName = data['serverName'],
//						challengeTimes = data['challengeTimes'],
						battleScore = data['battleScore'];
					$('#playName').html(playName + "(" + serverName + ")");
					$('#battleScore').html(battleScore);
					$('.right_mind').show();
				} else {
					alertMsg(obj['message'] || "获取用户信息出错啦~");
				}
			},
			error: function() {
				errorMsg("获取用户信息调用异常");
			}
		});
	}
	
	//开始挑战
	this.do_challenge = function(challengeLevelId) {
		console.log(challengeLevelId);
		$.ajax({
			type: 'POST',
			url: urlList.url_challenge(challengeLevelId),
			dataType: 'json',
			timeout: options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					options.payObj.challengeLevelId = challengeLevelId;
					alert_applyWay(data);
				} else {
					alertMsg(obj['message'] || "开始挑战出错啦~");
				}
			},
			error: function() {
				errorMsg("开始挑战调用异常");
			}
		});
	}
	
	//进入房间开始游戏
	this.do_enterRoom = function(challengeLevelId,orderId) {
		$.ajax({
			type: 'POST',
			url: urlList.url_enterRoom(challengeLevelId,orderId),
			dataType: 'json',
			timeout: options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					alert_enter(data);
				} else {
					alertMsg(obj['message'] || "进入房间出错啦~");
				}
			},
			error: function() {
				errorMsg("进入房间调用异常");
			}
		});
	}
	
	//查询支付状态
	this.do_payFinished = function() {
		$.ajax({
			type: 'POST',
			url: urlList.url_payFinished(options.payObj.orderId),
			dataType: 'json',
			timeout: options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					//支付成功隐藏二维码页面，进入房间
					closeQrcode();
					this_.do_enterRoom(options.payObj.challengeLevelId,options.payObj.orderId);
				}
			},
			error: function() {
				errorMsg("查询支付调用异常");
			}
		});
	}
	
	//查询挑战赛状态接口
	this.do_queryChallengeMatchState = function() {
		$.ajax({
			type: 'POST',
			url: urlList.url_queryChallengeMatchState(),
			dataType: 'json',
			timeout: options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					options.challengeStatus.isLogin = data.isLogin;
					options.challengeStatus.matchType = data.matchType;
					options.challengeStatus.allowTeam = data.allowTeam;
					options.challengeStatus.limitMinute = data.limitMinute;
					options.challengeStatus.levelLimit = data.levelLimit;
					options.challengeStatus.rankRemark = data.rankRemark;
				}
			},
			error: function() {
				errorMsg("查询挑战赛状态调用异常");
			}
		});
	}
	
	//获取所有挑战赛信息，用于切换
	this.do_getAllChallengeMatchInfo = function() {
		$.ajax({
			type: 'POST',
			url: urlList.url_getAllChallengeMatchInfo(),
			dataType: 'json',
			timeout: options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					if(data[0].challengeMatchId != options.challengeMatchId) {
						location.href = urlList.url_index(data[0].challengeMatchId);
					} else {
						location.href = urlList.url_index(data[1].challengeMatchId);
					}
					
				}
			},
			error: function() {
				errorMsg("获取所有挑战赛调用异常");
			}
		});
	}
	
	//获取挑战场次列表
	this.do_etChallengeLevelInfo = function() {
		$.ajax({
			type: 'POST',
			url: urlList.url_getChallengeLevelInfo(),
			dataType: 'json',
			timeout: options.ajaxTimeout,
			success: function(obj) {
				if(obj['success'] && obj['code'] == 0) {
					var data = obj['data'];
					for(var i = 0; i < data.length; i++) {
						var awardSwBean = data[i].awardSwBean,
							levelName = data[i].levelName,
							challengeLevelId = data[i].challengeLevelId,
							countdown = data[i].countdown,
							levelType = data[i].levelType,
							applySwBean = data[i].applySwBean,
							//0：可挑战; 1：挑战倒计时; 2：不可挑战；3:暂未开放；4：明日再战
							state = data[i].state;
							$('#content_' + levelType + ' .content_name').html(levelName);
							$('#content_' + levelType + ' .challenge_remind .normal_remind span').html(applySwBean);
							analysisChallenge(challengeLevelId);
					}
	
					function analysisChallenge(challengeLevelId) {
						//奖励顺豆dom
						var dom_shun = $('#content_' + levelType + ' .normal_modal');
						//奖励顺豆数目dom
						var dom_num_shun = $('#content_' + levelType + ' .num_normal .f30');
						//倒计时dom
						var dom_count_back = $('#content_' + levelType + ' .num_count');
						//操作按钮dom
						var dom_button = $('#content_' + levelType + ' a');
						//显示倒计时提示文字dom
						var dom_normal_remind = $('#content_' + levelType + ' .challenge_remind .normal_remind');
						//显示报名顺豆提示文字dom
						var dom_count_remind = $('#content_' + levelType + ' .challenge_remind .count_remind');
						
						//取消绑定hover事件
						dom_button.off('mouseenter').off('mouseleave').off('click');
						if(state == 1) { //挑战倒计时
							var countTime = new Date().getTime() + countdown * 1000;
							dom_count_back.show();
							//处理倒计时
							countBack(countTime, '#content_' + levelType + ' .num_count');
							dom_shun.hide();
							
							dom_button.removeClass().addClass('state_0').show();
							dom_normal_remind.hide();
							dom_count_remind.show();
							
							//绑定开始游戏
							$('#content_' + levelType + ' a').on('click', function() {
								startGame();
							})
						} else if(state == 0) { //可挑战
							dom_num_shun.html(awardSwBean);
							dom_shun.show();
							dom_count_back.hide();
							
							//设置按钮
							dom_button.removeClass().addClass('state_1').show();
							dom_normal_remind.show();
							dom_count_remind.hide();
							//绑定可挑战点击
							dom_button.on('click', function() {
								do_challengeValidate(false, options.challengeMatchId, options.challengeStatus.levelLimit, options.challengeStatus.rankRemark,function() {
									this_.do_challenge(challengeLevelId);
								});
							})
						} else if(state == 2 || state == 3 || state == 4) { //不可挑战
							dom_num_shun.html(awardSwBean);
							dom_shun.show();
							dom_count_back.hide();
							//设置按钮
							dom_button.removeClass().addClass('state_'+state).show();
							dom_normal_remind.show();
							dom_count_remind.hide();
						}
					}
					
				} else {
					alertMsg(obj['message'] || "场次列表出错啦~");
				}
			},
			error: function() {
				errorMsg("场次列表调用异常");
			}
		});
	}
	
	
	
//	var ClientAPI = {
//		getSubAccount:function(str) {
//			return true;
//		}
//	},
//	GameID = {
//		LOL : 1	
//	}
	/**
	 * 挑战校检
	 * @param validateLoginOnly boolean类型,true只校检登陆；false校检等级限制，段位限制等
	 * @param challengeMatchId
	 * @param levelLimit
	 * @param rankRemark
	 * @param callback 回调逻辑
     */
	var do_challengeValidate = function(validateLoginOnly, challengeMatchId, levelLimit, rankRemark, callBack){
		var gameId = GameID.LOL;
		//校检火马登录
		var user = ClientAPI.getLoginXingYun();
		if(!user.hasOwnProperty("userId") || user.userId == 0){
			//调起登陆窗
			ClientAPI.startLogin('VC_LOGIN');
			return;
		}

		//只校检登陆
		if(validateLoginOnly){
			callBack();
			return;
		}

		//校检游戏登录
		var loginGame = ClientAPI.getLoginGame(gameId);
		if(!loginGame) {
			$("#alert_msg2 .alert_title_h1").html("<p>请先登录<span class='blue'>" + GameName.get(gameId) + "</span>，才能报名参加比赛哦</p>");
			$("#alert_msg2").modal();
			$("#alert_msg2 .user_agreement").hide();
			$("#alert_msg2 .btn_sure").off("click").on("click", function(){
				$("#alert_msg2").modal("hide");
				//调起游戏登陆
				ClientAPI.switchStartInfo(gameId, true);
			});
			return;
		}

		//校检等级
		if(levelLimit == 30 && loginGame.level < levelLimit){
			alertMsg("召唤师等级<span class='blue'>未满30级</span>，不能参与挑战哦");
			return;
		}

		//校检段位
		if(!loginGame.rank ||loginGame.rank == ""){
			loginGame.rank = "无段位";
		}
		loginGame.rank = loginGame.rank.replace(/[0-9]/ig,"");
		if(rankRemark.indexOf(loginGame.rank) < 0){
			alertMsg("挑战赛需要[<span class='blue'>"+rankRemark+"</span>]段位的玩家才能参与哦");
			return;
		}

		//校检挑战赛状态和用户绑定关系
		var postData = {};
		postData.challengeMatchId = challengeMatchId;
		postData.gameId = gameId;
		postData.account = loginGame.account;
		var resultData = Action.getData(urlList.url_checkChallengeMatchUserState(gameId), postData);
		if(!resultData ){
			errorMsg("服务器异常，请稍后再试！");
			return;
		}
		if(!resultData['success'] && resultData['code']){
			if(resultData['code'] == 1004){
				var otherUser = resultData['data'];
				var head = staticPath + "upload/userhead/middle/" + ((otherUser.headImgUrl) ? otherUser.headImgUrl : "1") + ".png";
				$("#quick-switch .f14").html(GameName.get(loginGame.gameId) + '账号<span class="blue">' + loginGame.account + '</span>已绑定过火马账号，您可以：');
				$("#quick-switch .head_pic").attr("src", head);
				$("#quick-switch .changegame").show();
				$("#quick-switch").modal();
				$("#quick-switch .otherUser").off("click").on("click", function(){
					//调起客户端快速登录窗
					User.loginOtherUser(otherUser.userIdHex, function(retData){
						if(retData.success){
							$("#quick-switch").modal("hide");
						}else{
							errorMsg(retData.message);
						}
					});
				});
			}else{
				errorMsg(resultData.message);
			}
			return;
		}
		callBack();
		return;
	}
}

//init
var initObj = new detailObj();
initObj.init({
	hostUrl : "http://lol.icafe8.com/",
	barId : 1111,
	playerAccount : 254332471,
	challengeMatchId : $('#challengeMatchId').val() || 44,
	needShowRecord : $('#needShowRecord').val(),
	needShowRules : $('#needShowRules').val(),
	matchType : $('#matchType').val() || 1,
	needRefresh:true,
	ajaxTimeout:3000
})
//初始化绑定
initObj.eventElement();
//设置图片
initObj.setTitle();
//查询挑战赛状态，用于登录判断等
initObj.do_queryChallengeMatchState();
//展示纪录和规则
initObj.showChallengeRulesList();
//获取用户信息
initObj.getUserInfo();
//获取场次列表
initObj.do_etChallengeLevelInfo();
//暴露页面元素绑定的方法
var checkRoom =  initObj.checkRoom;
//绑定开始游戏方法
function startGame() {
	console.log("开始游戏");
}
