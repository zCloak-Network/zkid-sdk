// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* tslint:disable */
/* eslint-disable */


  var bufferView;
  var base64ReverseLookup = new Uint8Array(123/*'z'+1*/);
  for (var i = 25; i >= 0; --i) {
    base64ReverseLookup[48+i] = 52+i; // '0-9'
    base64ReverseLookup[65+i] = i; // 'A-Z'
    base64ReverseLookup[97+i] = 26+i; // 'a-z'
  }
  base64ReverseLookup[43] = 62; // '+'
  base64ReverseLookup[47] = 63; // '/'
  /** @noinline Inlining this function would mean expanding the base64 string 4x times in the source code, which Closure seems to be happy to do. */
  function base64DecodeToExistingUint8Array(uint8Array, offset, b64) {
    var b1, b2, i = 0, j = offset, bLength = b64.length, end = offset + (bLength*3>>2) - (b64[bLength-2] == '=') - (b64[bLength-1] == '=');
    for (; i < bLength; i += 4) {
      b1 = base64ReverseLookup[b64.charCodeAt(i+1)];
      b2 = base64ReverseLookup[b64.charCodeAt(i+2)];
      uint8Array[j++] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
      if (j < end) uint8Array[j++] = b1 << 4 | b2 >> 2;
      if (j < end) uint8Array[j++] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i+3)];
    }
  }
function initActiveSegments(imports) {
  base64DecodeToExistingUint8Array(bufferView, 1048576, "bGlicmFyeS9hbGxvYy9zcmMvcmF3X3ZlYy5yc2NhcGFjaXR5IG92ZXJmbG93AAAAHAAQABEAAAAAABAAHAAAAAYCAAAFAAAAaW5kZXggb3V0IG9mIGJvdW5kczogdGhlIGxlbiBpcyAgYnV0IHRoZSBpbmRleCBpcyAAAEgAEAAgAAAAaAAQABIAAAACAAAAAAAAAAEAAAADAAAAMDAwMTAyMDMwNDA1MDYwNzA4MDkxMDExMTIxMzE0MTUxNjE3MTgxOTIwMjEyMjIzMjQyNTI2MjcyODI5MzAzMTMyMzMzNDM1MzYzNzM4Mzk0MDQxNDI0MzQ0NDU0NjQ3NDg0OTUwNTE1MjUzNTQ1NTU2NTc1ODU5NjA2MTYyNjM2NDY1NjY2NzY4Njk3MDcxNzI3Mzc0NzU3Njc3Nzg3OTgwODE4MjgzODQ4NTg2ODc4ODg5OTA5MTkyOTM5NDk1OTY5Nzk4OTlzbGljZSBpbmRleCBzdGFydHMgYXQgIGJ1dCBlbmRzIGF0IABkARAAFgAAAHoBEAANAAAAL1VzZXJzL3poYW5nemhpY2hhby8uY2FyZ28vZ2l0L2NoZWNrb3V0cy9yZXNjdWUtaGFzaC0wNmUyOGJhNjM5ZTk2NTg0L2Q0MjRjZWIvc3JjL3V0aWxzL3dpbnRlcmZlbGwtY3J5cHRvL3NyYy9oYXNoL3Jlc2N1ZS9ycDY0XzI1Ni9tb2QucnMAAACYARAAiQAAAOMAAAANAAAAL3J1c3RjLzllYjNhZmU5ZWJlOWM3ZDJiODRiNzEwMDJkNDRmNGEwZWRhYzk1ZTAvbGlicmFyeS9hbGxvYy9zcmMvdmVjL21vZC5yczQCEABMAAAA1AcAACQAAABleHBlY3RlZCBsZW4gb2YgdmFsdWVzX2luX3U2NCB0byBiZSBbZXhhY3RseSA4XSBvciBbb3ZlciA4IGJ1dCBzaG91bGQgYmUgc29tZSBtdWx0aXBsZSBvZiA0XSBidXQgcmVjZWl2ZWQgAACQAhAAagAAAC9Vc2Vycy96aGFuZ3poaWNoYW8vLmNhcmdvL2dpdC9jaGVja291dHMvcmVzY3VlLWhhc2gtMDZlMjhiYTYzOWU5NjU4NC9kNDI0Y2ViL3NyYy9saWIucnMEAxAAWAAAACUAAAAFAAAAAAAAAGNhbGxlZCBgT3B0aW9uOjp1bndyYXAoKWAgb24gYSBgTm9uZWAgdmFsdWVsaWJyYXJ5L3N0ZC9zcmMvcGFuaWNraW5nLnJzAJsDEAAcAAAAPgIAAB4AAACTvAU//hElwVCNvNR3gRPeqztR7TMRpEEHFFTxizWbi/xm9XFbrBGI7VG1bo17a9mfq4/gtiHejGe25speLSC9kFWITVS/PyAV0sf+h4aJCLeF+NTq5Rp7yHFDgD/hMJKydThYmK46yq+EyEKBDRWDtil5rBBqHlt/aPGnyjzMr4ga4/v+ctVjuuwOspLOy6SRslC0lPmB+Clt+kr9lSsR70k33eidyF4lv8ili9myHRlXirBq9IoWfmAZw/wGtQBNHMpWgt4K4tgkHqceD4G4oOU7e1nmjbk5yU4zSZp8CMsRFEvocoqy/2IPQXADRqqIrdnBZeY5cnCG0rI18eK6wJObdz3tO42ddtEdx0F+z0mqPc0CgaJRhRXqroZyifvu2NzK2MFVVPqrV/9jwZ5ni5virgiCdUx4XdGlLRvmy9LpqYIIjSO0AtGa+4no4xIxQhLfzhOSVAf2ytQVge1Gw28bDf7QC3e9MjHKcfo5gTXS0JQzpnDrkAaHlUgPw0/746WWYRbovblaMKHPFUUAzSjYRIK5oeaC+Mx5B3XcA6kgXQdhyVlFtBzrkhNo3ArsG6xZnPHs44o0i+6WG6eKoWHgnaBAjegwHQn4lWoyHRyVp/0y2E3ehyow0wj17Fm5BjFqN6ezwVcyzolEV6eGW4yHu9JQwv7bXkOO8sYKKs3LeBhlARwZH3qd+a2G6KyC1HzWUZxTprx4yHxpL5ey4ftdZBWfP21SNmGVEwtqlFLn4iAxMfl3TASJjEM6vxMIhcZ5HhqF9D0LKCd2VK1V6PC34+aEA9Hny4z3yIuAPk0iDT+OCyGgI6dpTg6oUrHx2hcdcWme9zxk+i0jf4q6DRzB6McrlVIQ1uM9d9d77BVVzn5mAfR5er7gtQecIGcZQo+tGYvfblArXvfFs+V3b+uuYpsADFopRt163geYTP1qcM/iRz8pWwNbArL9xs4GOhSOEMyCxF385308xdhSwI5xjQnd/0bz4OuRr+UyqOyTSe/4GYnx3GNtstPduCWyn+lBndV9Ir1TWieoMEXHQNbqjKzsKy7k04GxuBNLU5+1p288Sb3xl4/ImcYb6KMmnbEW0hZtzSgOK/Kngm8KQR/3T6KnmILqwxnNSzes41Wrllfz0k1fvLpxGtuwCsI9EPgG/2jXkPxSU4V/H7W30gTaH+hnRgkQjJinTBMbISFj+1ivrcU1JlQbJCBKwLN/RR+R/HJhG8PWbeL0GkvCGs4HyI7KjA0uoHaHIqyrdI5Wh3XDm7MER1C+0siRZjre/591pMqzH/QzDNg2AXU+VWFvBArlLTfU4AaY3MIgJBqnIAkjjfBPYGPs3osCaCg6lmQV446S/z0GH8yYXwVi7hl91X7Tu+ZoRunNGNFEAnqo9+QtbO2gk4NdPJTdTym+62SfH7Zq0beMshovFYcwgLi89v9f/3d1DJgZov0jIkL6J00LTb42a9py9k0mI8238Bf4+MOoJwVNFJ0kWwl2gPhIZ5nN6flj9vyh05T+CcUFDNsZUq5hpnCjHkWd0HomZKAIBvPb8Xd35R5FhxcQJqWrcCVbD/mCXotMIOv3VxCfk9fuPNr1nkEfLzkpaTrndSE9r6flqz+X5nUYke2KTUvzO4TDPk09rJCj9H7ArU+nY7WECQJF1a7BOnHPrE3ALS94K7uA/qcjMt+mBJkBCqtxx5iacT0kDF0KwKIjlwIr9hWWs3RiGwIjNvG38GVglSXR8JzXXpwQxe8B/lPC50GF1QWGM92/xkbUbPV8sLr8RD8LR1M5NjYLylfB8WpghSvGwjJEHcsKRNZhFcGbZOvM5eupLCAqfAEMTyr+myvn51Bh9h9vW0lOem4Fx5n9hOAKOiJxNqnV45EwmJ3uqsoCZ1A3HgIQTIrraEX3Y7cvui2nsMT2sDaAiQAAAAB8ylVsXIPALq5sESRGa8NMZ/OEMZs+g2s4/zmyCF6SxCe5A/ODZZRAdgEb+MySYkzHRfkWkzLcLvU26yveuWkXX8trSDbQhXOIEHHkHT729EfakOc2Vg7YtuhoSWcrn0BuCI1fNtmII7JOXoXsR8qVnlvgVlMrqwV5OZarfs3SwK3fOuLLTc33qu0F+188XskxuaKN7u34qD/i96AXr7Wm1pBZW7uTjg0PgRM6YY06LFvpQ1hlQkRAya8RH1FbR/XjutS3XfLUl5DYz0c8yqZ+qKwysQ0ni7pWCnJdpmjpv5IVetKSIa1WD8lKCNbOQyvxCMfBQoVS8cUtKkjoEo8ytJSYwBnwfpEx7aY1H7pvOMH8fbVKUsp6mSFDYZQuhIReVOZyuaNF2X/b0YeBbEwE1KNwi3q7F9/W3ZN+On64Smxqtc9BFovSMXpyuJ81blzOsuCS6r6HW6FZ0aaM1r/Uz46RBR42SyUlV4rbE33C3OM2PzXO0mYmnUAOI7FO6HD5X4mJ4BrUy4pG/Cf0J7pwhFA9HcKT5evAOwQ9Fz9NKJQ69e3dUQSbF0JER/ImnUtpdL+8B/iHhxDCKxZUUHY1u26X3u5cTMpHBEDoh452pqrEtL2W7SxzcOKHZxJQryeHKQtGfQ5KRKL094+Fq625Fq6rlI00+yui/mxa6NOe2kYl+EWQ06IIlOMU9jT1BcNkrN+gcXObRxlUnGLEPwfyAU+0Oxl0BYoAaBObSdtkvSAVAH3zZzQArl+Tpy8KhK6dzXZOWjrLLm4pXU6qU1J7V0NdbS1NkNmhyS8QSEHItynWXcdEdZ2oHD5RPSPI0BPlSCJIs6z6N8tUHpMYPNrML0tS9dy9HJ8gLDsg48QYqMFSXZDXC7LwAIDEX7MuX8u1ucJcaxU+SzwUOBjiqxTF94l/TwIQbElIPib7fWgoDrbK82iMHJzGOFboPu8Jo2w0lXrVkxr2gpyDR0EgjVNPJC6LBAH/INXEGLaJT95VOXhhRoaHR/HouYc5bSTTJ5uxVdmfqMILkae9jsBVV1KomzcRCCB2iJOZJ2DwSc+LXxApE6Uvp8jjMjdQKC5VQ722PNlbSUiAI9Q8q++e2w884DhgWx1wyTrvtleLFk3hHEUS6FwIOGocmrGeShCL3F5kSUxL0J7CTh8p/KDBBLNwfxPX3vMFyYiHo0KDDpE1G/Fukf+gHQrUoZ0Bnwdzyvk5zuZyPj4DASXLK6Wb0YF7yg8mdATKpuv1LA9Mrnn+WJ/UPRPe2CXBMB+FJ1IIZ0wgAE6KnAQyjzMpz2RHr13wVJGL5j80KaDUEjyIBDXmZKr2pJrhT/5B300Yp5g/cR4/Vhtpi5seojnRJ7ZokwZvulhCvJROoF0JodJRL83ep3TOt8Bku0y3VP5NcjpNAE0=");
}
function wasm2js_trap() { throw new Error('abort'); }

function asmFunc(imports) {
 var buffer = new ArrayBuffer(1114112);
 var HEAP8 = new Int8Array(buffer);
 var HEAP16 = new Int16Array(buffer);
 var HEAP32 = new Int32Array(buffer);
 var HEAPU8 = new Uint8Array(buffer);
 var HEAPU16 = new Uint16Array(buffer);
 var HEAPU32 = new Uint32Array(buffer);
 var HEAPF32 = new Float32Array(buffer);
 var HEAPF64 = new Float64Array(buffer);
 var Math_imul = Math.imul;
 var Math_fround = Math.fround;
 var Math_abs = Math.abs;
 var Math_clz32 = Math.clz32;
 var Math_min = Math.min;
 var Math_max = Math.max;
 var Math_floor = Math.floor;
 var Math_ceil = Math.ceil;
 var Math_trunc = Math.trunc;
 var Math_sqrt = Math.sqrt;
 var nan = NaN;
 var infinity = Infinity;
 var global$0 = 1048576;
 var i64toi32_i32$HIGH_BITS = 0;
 function $0($0_1) {
  var $1_1 = 0, $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         label$8 : {
          label$9 : {
           label$10 : {
            label$11 : {
             label$12 : {
              label$13 : {
               label$14 : {
                label$15 : {
                 label$16 : {
                  label$17 : {
                   label$18 : {
                    label$19 : {
                     label$20 : {
                      label$21 : {
                       if ($0_1 >>> 0 >= 245) {
                        if ($0_1 >>> 0 >= 4294901709) {
                         break label$2
                        }
                        $0_1 = $0_1 + 11 | 0;
                        $3_1 = $0_1 & -8;
                        $7_1 = HEAP32[263115];
                        if (!$7_1) {
                         break label$17
                        }
                        $5_1 = 0 - $3_1 | 0;
                        $6_1 = 0;
                        label$23 : {
                         if ($3_1 >>> 0 < 256) {
                          break label$23
                         }
                         $6_1 = 31;
                         if ($3_1 >>> 0 > 16777215) {
                          break label$23
                         }
                         $0_1 = Math_clz32($0_1 >>> 8 | 0);
                         $6_1 = (($3_1 >>> 6 - $0_1 & 1) - ($0_1 << 1) | 0) + 62 | 0;
                        }
                        $1_1 = HEAP32[($6_1 << 2) + 1052048 >> 2];
                        if ($1_1) {
                         break label$21
                        }
                        $0_1 = 0;
                        break label$20;
                       }
                       label$24 : {
                        label$25 : {
                         label$26 : {
                          label$27 : {
                           label$28 : {
                            label$29 : {
                             $5_1 = HEAP32[263114];
                             $3_1 = $0_1 >>> 0 < 11 ? 16 : $0_1 + 11 & -8;
                             $0_1 = $3_1 >>> 3 | 0;
                             $2_1 = $5_1 >>> $0_1 | 0;
                             if (!($2_1 & 3)) {
                              if (HEAPU32[263116] >= $3_1 >>> 0) {
                               break label$17
                              }
                              if ($2_1) {
                               break label$29
                              }
                              $0_1 = HEAP32[263115];
                              if (!$0_1) {
                               break label$17
                              }
                              $4_1 = HEAP32[(__wasm_ctz_i32($0_1 & 0 - $0_1) << 2) + 1052048 >> 2];
                              $1_1 = (HEAP32[$4_1 + 4 >> 2] & -8) - $3_1 | 0;
                              $0_1 = HEAP32[$4_1 + 16 >> 2];
                              if (!$0_1) {
                               $0_1 = HEAP32[$4_1 + 20 >> 2]
                              }
                              if ($0_1) {
                               while (1) {
                                $2_1 = (HEAP32[$0_1 + 4 >> 2] & -8) - $3_1 | 0;
                                $6_1 = $2_1 >>> 0 < $1_1 >>> 0;
                                $1_1 = $6_1 ? $2_1 : $1_1;
                                $4_1 = $6_1 ? $0_1 : $4_1;
                                $2_1 = HEAP32[$0_1 + 16 >> 2];
                                if ($2_1) {
                                 $0_1 = $2_1
                                } else {
                                 $0_1 = HEAP32[$0_1 + 20 >> 2]
                                }
                                if ($0_1) {
                                 continue
                                }
                                break;
                               }
                              }
                              $7($4_1);
                              if ($1_1 >>> 0 < 16) {
                               break label$25
                              }
                              HEAP32[$4_1 + 4 >> 2] = $3_1 | 3;
                              $5_1 = $3_1 + $4_1 | 0;
                              HEAP32[$5_1 + 4 >> 2] = $1_1 | 1;
                              HEAP32[$1_1 + $5_1 >> 2] = $1_1;
                              $0_1 = HEAP32[263116];
                              if (!$0_1) {
                               break label$26
                              }
                              $2_1 = ($0_1 & -8) + 1052192 | 0;
                              $7_1 = HEAP32[263118];
                              $6_1 = HEAP32[263114];
                              $0_1 = 1 << ($0_1 >>> 3);
                              if (!($6_1 & $0_1)) {
                               break label$28
                              }
                              $0_1 = HEAP32[$2_1 + 8 >> 2];
                              break label$27;
                             }
                             $4_1 = $0_1 + (($2_1 ^ -1) & 1) | 0;
                             $0_1 = $4_1 << 3;
                             $6_1 = HEAP32[$0_1 + 1052200 >> 2];
                             $1_1 = $6_1 + 8 | 0;
                             $2_1 = HEAP32[$1_1 >> 2];
                             $0_1 = $0_1 + 1052192 | 0;
                             label$36 : {
                              if (($2_1 | 0) != ($0_1 | 0)) {
                               HEAP32[$2_1 + 12 >> 2] = $0_1;
                               HEAP32[$0_1 + 8 >> 2] = $2_1;
                               break label$36;
                              }
                              (wasm2js_i32$0 = 1052456, wasm2js_i32$1 = __wasm_rotl_i32($4_1) & $5_1), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
                             }
                             $0_1 = $4_1 << 3;
                             HEAP32[$6_1 + 4 >> 2] = $0_1 | 3;
                             $0_1 = $0_1 + $6_1 | 0;
                             HEAP32[$0_1 + 4 >> 2] = HEAP32[$0_1 + 4 >> 2] | 1;
                             return $1_1;
                            }
                            $1_1 = $0_1 & 31;
                            $0_1 = 2 << $1_1;
                            $0_1 = (0 - $0_1 | $0_1) & $2_1 << $1_1;
                            $2_1 = __wasm_ctz_i32(0 - $0_1 & $0_1);
                            $0_1 = $2_1 << 3;
                            $7_1 = HEAP32[$0_1 + 1052200 >> 2];
                            $4_1 = $7_1 + 8 | 0;
                            $1_1 = HEAP32[$4_1 >> 2];
                            $0_1 = $0_1 + 1052192 | 0;
                            label$38 : {
                             if (($1_1 | 0) != ($0_1 | 0)) {
                              HEAP32[$1_1 + 12 >> 2] = $0_1;
                              HEAP32[$0_1 + 8 >> 2] = $1_1;
                              break label$38;
                             }
                             (wasm2js_i32$0 = 1052456, wasm2js_i32$1 = __wasm_rotl_i32($2_1) & $5_1), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
                            }
                            HEAP32[$7_1 + 4 >> 2] = $3_1 | 3;
                            $6_1 = $3_1 + $7_1 | 0;
                            $0_1 = $2_1 << 3;
                            $5_1 = $0_1 - $3_1 | 0;
                            HEAP32[$6_1 + 4 >> 2] = $5_1 | 1;
                            HEAP32[$0_1 + $7_1 >> 2] = $5_1;
                            $0_1 = HEAP32[263116];
                            if ($0_1) {
                             $1_1 = ($0_1 & -8) + 1052192 | 0;
                             $7_1 = HEAP32[263118];
                             $2_1 = HEAP32[263114];
                             $0_1 = 1 << ($0_1 >>> 3);
                             if ($2_1 & $0_1) {
                              $0_1 = HEAP32[$1_1 + 8 >> 2]
                             } else {
                              HEAP32[263114] = $0_1 | $2_1;
                              $0_1 = $1_1;
                             }
                             HEAP32[$1_1 + 8 >> 2] = $7_1;
                             HEAP32[$0_1 + 12 >> 2] = $7_1;
                             HEAP32[$7_1 + 12 >> 2] = $1_1;
                             HEAP32[$7_1 + 8 >> 2] = $0_1;
                            }
                            HEAP32[263118] = $6_1;
                            HEAP32[263116] = $5_1;
                            return $4_1;
                           }
                           HEAP32[263114] = $0_1 | $6_1;
                           $0_1 = $2_1;
                          }
                          HEAP32[$2_1 + 8 >> 2] = $7_1;
                          HEAP32[$0_1 + 12 >> 2] = $7_1;
                          HEAP32[$7_1 + 12 >> 2] = $2_1;
                          HEAP32[$7_1 + 8 >> 2] = $0_1;
                         }
                         HEAP32[263118] = $5_1;
                         HEAP32[263116] = $1_1;
                         break label$24;
                        }
                        $0_1 = $1_1 + $3_1 | 0;
                        HEAP32[$4_1 + 4 >> 2] = $0_1 | 3;
                        $0_1 = $0_1 + $4_1 | 0;
                        HEAP32[$0_1 + 4 >> 2] = HEAP32[$0_1 + 4 >> 2] | 1;
                       }
                       break label$1;
                      }
                      $0_1 = 0;
                      $9_1 = $3_1 << (($6_1 | 0) != 31 ? 25 - ($6_1 >>> 1 | 0) & 31 : 0);
                      while (1) {
                       label$44 : {
                        $2_1 = HEAP32[$1_1 + 4 >> 2] & -8;
                        if ($2_1 >>> 0 < $3_1 >>> 0) {
                         break label$44
                        }
                        $2_1 = $2_1 - $3_1 | 0;
                        if ($2_1 >>> 0 >= $5_1 >>> 0) {
                         break label$44
                        }
                        $4_1 = $1_1;
                        $5_1 = $2_1;
                        if ($2_1) {
                         break label$44
                        }
                        $5_1 = 0;
                        $0_1 = $1_1;
                        break label$19;
                       }
                       $2_1 = HEAP32[$1_1 + 20 >> 2];
                       $1_1 = HEAP32[(($9_1 >>> 29 & 4) + $1_1 | 0) + 16 >> 2];
                       $0_1 = $2_1 ? (($2_1 | 0) != ($1_1 | 0) ? $2_1 : $0_1) : $0_1;
                       $9_1 = $9_1 << 1;
                       if ($1_1) {
                        continue
                       }
                       break;
                      };
                     }
                     if (!($0_1 | $4_1)) {
                      $4_1 = 0;
                      $0_1 = 2 << $6_1;
                      $0_1 = (0 - $0_1 | $0_1) & $7_1;
                      if (!$0_1) {
                       break label$17
                      }
                      $0_1 = HEAP32[(__wasm_ctz_i32($0_1 & 0 - $0_1) << 2) + 1052048 >> 2];
                     }
                     if (!$0_1) {
                      break label$18
                     }
                    }
                    while (1) {
                     $1_1 = HEAP32[$0_1 + 4 >> 2] & -8;
                     $2_1 = $1_1 - $3_1 | 0;
                     $1_1 = $2_1 >>> 0 < $5_1 >>> 0 & $1_1 >>> 0 >= $3_1 >>> 0;
                     $4_1 = $1_1 ? $0_1 : $4_1;
                     $5_1 = $1_1 ? $2_1 : $5_1;
                     $1_1 = HEAP32[$0_1 + 16 >> 2];
                     if ($1_1) {
                      $0_1 = $1_1
                     } else {
                      $0_1 = HEAP32[$0_1 + 20 >> 2]
                     }
                     if ($0_1) {
                      continue
                     }
                     break;
                    };
                   }
                   if (!$4_1) {
                    break label$17
                   }
                   $0_1 = HEAP32[263116];
                   if ($0_1 >>> 0 >= $3_1 >>> 0 & $0_1 - $3_1 >>> 0 <= $5_1 >>> 0) {
                    break label$17
                   }
                   $7($4_1);
                   if ($5_1 >>> 0 < 16) {
                    break label$15
                   }
                   HEAP32[$4_1 + 4 >> 2] = $3_1 | 3;
                   $6_1 = $3_1 + $4_1 | 0;
                   HEAP32[$6_1 + 4 >> 2] = $5_1 | 1;
                   HEAP32[$5_1 + $6_1 >> 2] = $5_1;
                   if ($5_1 >>> 0 < 256) {
                    break label$16
                   }
                   $8($6_1, $5_1);
                   break label$1;
                  }
                  $2_1 = HEAP32[263116];
                  if ($2_1 >>> 0 >= $3_1 >>> 0) {
                   break label$14
                  }
                  $0_1 = HEAP32[263117];
                  if ($0_1 >>> 0 > $3_1 >>> 0) {
                   break label$9
                  }
                  $5_1 = 0;
                  $2_1 = $3_1 + 65583 | 0;
                  $1_1 = __wasm_memory_grow($2_1 >>> 16 | 0);
                  $0_1 = ($1_1 | 0) == -1;
                  if ($0_1) {
                   break label$2
                  }
                  $8_1 = $1_1 << 16;
                  if (!$8_1) {
                   break label$2
                  }
                  $5_1 = $0_1 ? 0 : $2_1 & -65536;
                  $1_1 = $5_1 + HEAP32[263120] | 0;
                  HEAP32[263120] = $1_1;
                  $0_1 = HEAP32[263121];
                  HEAP32[263121] = $0_1 >>> 0 > $1_1 >>> 0 ? $0_1 : $1_1;
                  $9_1 = HEAP32[263119];
                  if (!$9_1) {
                   break label$13
                  }
                  $0_1 = 1052176;
                  while (1) {
                   $2_1 = HEAP32[$0_1 >> 2];
                   $1_1 = HEAP32[$0_1 + 4 >> 2];
                   if (($8_1 | 0) == ($2_1 + $1_1 | 0)) {
                    break label$12
                   }
                   $0_1 = HEAP32[$0_1 + 8 >> 2];
                   if ($0_1) {
                    continue
                   }
                   break;
                  };
                  break label$11;
                 }
                 $1_1 = ($5_1 & -8) + 1052192 | 0;
                 $2_1 = HEAP32[263114];
                 $0_1 = 1 << ($5_1 >>> 3);
                 if ($2_1 & $0_1) {
                  $0_1 = HEAP32[$1_1 + 8 >> 2]
                 } else {
                  HEAP32[263114] = $0_1 | $2_1;
                  $0_1 = $1_1;
                 }
                 HEAP32[$1_1 + 8 >> 2] = $6_1;
                 HEAP32[$0_1 + 12 >> 2] = $6_1;
                 HEAP32[$6_1 + 12 >> 2] = $1_1;
                 HEAP32[$6_1 + 8 >> 2] = $0_1;
                 break label$1;
                }
                $0_1 = $3_1 + $5_1 | 0;
                HEAP32[$4_1 + 4 >> 2] = $0_1 | 3;
                $0_1 = $0_1 + $4_1 | 0;
                HEAP32[$0_1 + 4 >> 2] = HEAP32[$0_1 + 4 >> 2] | 1;
                break label$1;
               }
               $6_1 = HEAP32[263118];
               $1_1 = $2_1 - $3_1 | 0;
               label$52 : {
                if ($1_1 >>> 0 <= 15) {
                 HEAP32[263118] = 0;
                 HEAP32[263116] = 0;
                 HEAP32[$6_1 + 4 >> 2] = $2_1 | 3;
                 $0_1 = $2_1 + $6_1 | 0;
                 HEAP32[$0_1 + 4 >> 2] = HEAP32[$0_1 + 4 >> 2] | 1;
                 break label$52;
                }
                HEAP32[263116] = $1_1;
                $0_1 = $3_1 + $6_1 | 0;
                HEAP32[263118] = $0_1;
                HEAP32[$0_1 + 4 >> 2] = $1_1 | 1;
                HEAP32[$2_1 + $6_1 >> 2] = $1_1;
                HEAP32[$6_1 + 4 >> 2] = $3_1 | 3;
               }
               return $6_1 + 8 | 0;
              }
              $0_1 = HEAP32[263123];
              if (!$0_1 | $0_1 >>> 0 > $8_1 >>> 0) {
               break label$7
              }
              break label$4;
             }
             if (HEAP32[$0_1 + 12 >> 2] | $2_1 >>> 0 > $9_1 >>> 0) {
              break label$11
             }
             if ($8_1 >>> 0 > $9_1 >>> 0) {
              break label$10
             }
            }
            $0_1 = HEAP32[263123];
            HEAP32[263123] = $0_1 >>> 0 < $8_1 >>> 0 ? $0_1 : $8_1;
            $1_1 = $5_1 + $8_1 | 0;
            $0_1 = 1052176;
            label$54 : {
             label$55 : {
              while (1) {
               if (HEAP32[$0_1 >> 2] != ($1_1 | 0)) {
                $0_1 = HEAP32[$0_1 + 8 >> 2];
                if ($0_1) {
                 continue
                }
                break label$55;
               }
               break;
              };
              if (!HEAP32[$0_1 + 12 >> 2]) {
               break label$54
              }
             }
             $0_1 = 1052176;
             while (1) {
              label$59 : {
               $1_1 = HEAP32[$0_1 >> 2];
               if ($1_1 >>> 0 <= $9_1 >>> 0) {
                $4_1 = $1_1 + HEAP32[$0_1 + 4 >> 2] | 0;
                if ($4_1 >>> 0 > $9_1 >>> 0) {
                 break label$59
                }
               }
               $0_1 = HEAP32[$0_1 + 8 >> 2];
               continue;
              }
              break;
             };
             HEAP32[263119] = $8_1;
             $0_1 = $5_1 - 40 | 0;
             HEAP32[263117] = $0_1;
             HEAP32[$8_1 + 4 >> 2] = $0_1 | 1;
             HEAP32[($0_1 + $8_1 | 0) + 4 >> 2] = 40;
             HEAP32[263122] = 2097152;
             $0_1 = ($4_1 - 32 & -8) - 8 | 0;
             $7_1 = $0_1 >>> 0 < $9_1 + 16 >>> 0 ? $9_1 : $0_1;
             HEAP32[$7_1 + 4 >> 2] = 27;
             $6_1 = HEAP32[263044];
             $2_1 = HEAP32[263045];
             $0_1 = HEAP32[263047];
             $1_1 = $7_1 + 16 | 0;
             HEAP32[$1_1 >> 2] = HEAP32[263046];
             HEAP32[$1_1 + 4 >> 2] = $0_1;
             HEAP32[$7_1 + 8 >> 2] = $6_1;
             HEAP32[$7_1 + 12 >> 2] = $2_1;
             HEAP32[263045] = $5_1;
             HEAP32[263044] = $8_1;
             HEAP32[263046] = $7_1 + 8;
             HEAP32[263047] = 0;
             $0_1 = $7_1 + 28 | 0;
             while (1) {
              HEAP32[$0_1 >> 2] = 7;
              $0_1 = $0_1 + 4 | 0;
              if ($4_1 >>> 0 > $0_1 >>> 0) {
               continue
              }
              break;
             };
             if (($7_1 | 0) == ($9_1 | 0)) {
              break label$3
             }
             HEAP32[$7_1 + 4 >> 2] = HEAP32[$7_1 + 4 >> 2] & -2;
             $0_1 = $7_1 - $9_1 | 0;
             HEAP32[$9_1 + 4 >> 2] = $0_1 | 1;
             HEAP32[$7_1 >> 2] = $0_1;
             if ($0_1 >>> 0 >= 256) {
              $8($9_1, $0_1);
              break label$3;
             }
             $1_1 = ($0_1 & -8) + 1052192 | 0;
             $2_1 = HEAP32[263114];
             $0_1 = 1 << ($0_1 >>> 3);
             if ($2_1 & $0_1) {
              $0_1 = HEAP32[$1_1 + 8 >> 2]
             } else {
              HEAP32[263114] = $0_1 | $2_1;
              $0_1 = $1_1;
             }
             HEAP32[$1_1 + 8 >> 2] = $9_1;
             HEAP32[$0_1 + 12 >> 2] = $9_1;
             HEAP32[$9_1 + 12 >> 2] = $1_1;
             HEAP32[$9_1 + 8 >> 2] = $0_1;
             break label$3;
            }
            HEAP32[$0_1 >> 2] = $8_1;
            HEAP32[$0_1 + 4 >> 2] = $5_1 + HEAP32[$0_1 + 4 >> 2];
            HEAP32[$8_1 + 4 >> 2] = $3_1 | 3;
            $4_1 = $3_1 + $8_1 | 0;
            $3_1 = $1_1 - $4_1 | 0;
            if (HEAP32[263119] != ($1_1 | 0)) {
             if (HEAP32[263118] == ($1_1 | 0)) {
              break label$8
             }
             $5_1 = HEAP32[$1_1 + 4 >> 2];
             if (($5_1 & 3) != 1) {
              break label$6
             }
             $6_1 = $5_1 & -8;
             label$66 : {
              if ($6_1 >>> 0 >= 256) {
               $7($1_1);
               break label$66;
              }
              $2_1 = HEAP32[$1_1 + 12 >> 2];
              $0_1 = HEAP32[$1_1 + 8 >> 2];
              if (($2_1 | 0) != ($0_1 | 0)) {
               HEAP32[$0_1 + 12 >> 2] = $2_1;
               HEAP32[$2_1 + 8 >> 2] = $0_1;
               break label$66;
              }
              (wasm2js_i32$0 = 1052456, wasm2js_i32$1 = HEAP32[263114] & __wasm_rotl_i32($5_1 >>> 3 | 0)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
             }
             $3_1 = $3_1 + $6_1 | 0;
             $1_1 = $1_1 + $6_1 | 0;
             $5_1 = HEAP32[$1_1 + 4 >> 2];
             break label$6;
            }
            HEAP32[263119] = $4_1;
            $0_1 = HEAP32[263117] + $3_1 | 0;
            HEAP32[263117] = $0_1;
            HEAP32[$4_1 + 4 >> 2] = $0_1 | 1;
            break label$5;
           }
           HEAP32[$0_1 + 4 >> 2] = $1_1 + $5_1;
           $6_1 = $5_1 + HEAP32[263117] | 0;
           $2_1 = HEAP32[263119];
           $1_1 = $2_1 + 15 & -8;
           HEAP32[263119] = $1_1 - 8;
           $0_1 = ($6_1 + ($2_1 - $1_1 | 0) | 0) + 8 | 0;
           HEAP32[263117] = $0_1;
           HEAP32[$1_1 - 4 >> 2] = $0_1 | 1;
           HEAP32[($2_1 + $6_1 | 0) + 4 >> 2] = 40;
           HEAP32[263122] = 2097152;
           break label$3;
          }
          $1_1 = $0_1 - $3_1 | 0;
          HEAP32[263117] = $1_1;
          $2_1 = HEAP32[263119];
          $0_1 = $2_1 + $3_1 | 0;
          HEAP32[263119] = $0_1;
          HEAP32[$0_1 + 4 >> 2] = $1_1 | 1;
          HEAP32[$2_1 + 4 >> 2] = $3_1 | 3;
          $5_1 = $2_1 + 8 | 0;
          break label$2;
         }
         HEAP32[263118] = $4_1;
         $0_1 = HEAP32[263116] + $3_1 | 0;
         HEAP32[263116] = $0_1;
         HEAP32[$4_1 + 4 >> 2] = $0_1 | 1;
         HEAP32[$0_1 + $4_1 >> 2] = $0_1;
         break label$5;
        }
        HEAP32[263123] = $8_1;
        break label$4;
       }
       HEAP32[$1_1 + 4 >> 2] = $5_1 & -2;
       HEAP32[$4_1 + 4 >> 2] = $3_1 | 1;
       HEAP32[$3_1 + $4_1 >> 2] = $3_1;
       if ($3_1 >>> 0 >= 256) {
        $8($4_1, $3_1);
        break label$5;
       }
       $1_1 = ($3_1 & -8) + 1052192 | 0;
       $2_1 = HEAP32[263114];
       $0_1 = 1 << ($3_1 >>> 3);
       if ($2_1 & $0_1) {
        $0_1 = HEAP32[$1_1 + 8 >> 2]
       } else {
        HEAP32[263114] = $0_1 | $2_1;
        $0_1 = $1_1;
       }
       HEAP32[$1_1 + 8 >> 2] = $4_1;
       HEAP32[$0_1 + 12 >> 2] = $4_1;
       HEAP32[$4_1 + 12 >> 2] = $1_1;
       HEAP32[$4_1 + 8 >> 2] = $0_1;
      }
      return $8_1 + 8 | 0;
     }
     HEAP32[263124] = 4095;
     HEAP32[263045] = $5_1;
     HEAP32[263044] = $8_1;
     HEAP32[263051] = 1052192;
     HEAP32[263053] = 1052200;
     HEAP32[263050] = 1052192;
     HEAP32[263055] = 1052208;
     HEAP32[263052] = 1052200;
     HEAP32[263057] = 1052216;
     HEAP32[263054] = 1052208;
     HEAP32[263059] = 1052224;
     HEAP32[263056] = 1052216;
     HEAP32[263061] = 1052232;
     HEAP32[263058] = 1052224;
     HEAP32[263063] = 1052240;
     HEAP32[263060] = 1052232;
     HEAP32[263065] = 1052248;
     HEAP32[263062] = 1052240;
     HEAP32[263047] = 0;
     HEAP32[263067] = 1052256;
     HEAP32[263064] = 1052248;
     HEAP32[263066] = 1052256;
     HEAP32[263069] = 1052264;
     HEAP32[263068] = 1052264;
     HEAP32[263071] = 1052272;
     HEAP32[263070] = 1052272;
     HEAP32[263073] = 1052280;
     HEAP32[263072] = 1052280;
     HEAP32[263075] = 1052288;
     HEAP32[263074] = 1052288;
     HEAP32[263077] = 1052296;
     HEAP32[263076] = 1052296;
     HEAP32[263079] = 1052304;
     HEAP32[263078] = 1052304;
     HEAP32[263081] = 1052312;
     HEAP32[263080] = 1052312;
     HEAP32[263083] = 1052320;
     HEAP32[263085] = 1052328;
     HEAP32[263082] = 1052320;
     HEAP32[263087] = 1052336;
     HEAP32[263084] = 1052328;
     HEAP32[263089] = 1052344;
     HEAP32[263086] = 1052336;
     HEAP32[263091] = 1052352;
     HEAP32[263088] = 1052344;
     HEAP32[263093] = 1052360;
     HEAP32[263090] = 1052352;
     HEAP32[263095] = 1052368;
     HEAP32[263092] = 1052360;
     HEAP32[263097] = 1052376;
     HEAP32[263094] = 1052368;
     HEAP32[263099] = 1052384;
     HEAP32[263096] = 1052376;
     HEAP32[263101] = 1052392;
     HEAP32[263098] = 1052384;
     HEAP32[263103] = 1052400;
     HEAP32[263100] = 1052392;
     HEAP32[263105] = 1052408;
     HEAP32[263102] = 1052400;
     HEAP32[263107] = 1052416;
     HEAP32[263104] = 1052408;
     HEAP32[263109] = 1052424;
     HEAP32[263106] = 1052416;
     HEAP32[263111] = 1052432;
     HEAP32[263108] = 1052424;
     HEAP32[263113] = 1052440;
     HEAP32[263110] = 1052432;
     HEAP32[263119] = $8_1;
     HEAP32[263112] = 1052440;
     $0_1 = $5_1 - 40 | 0;
     HEAP32[263117] = $0_1;
     HEAP32[$8_1 + 4 >> 2] = $0_1 | 1;
     HEAP32[($0_1 + $8_1 | 0) + 4 >> 2] = 40;
     HEAP32[263122] = 2097152;
    }
    $5_1 = 0;
    $0_1 = HEAP32[263117];
    if ($0_1 >>> 0 <= $3_1 >>> 0) {
     break label$2
    }
    $1_1 = $0_1 - $3_1 | 0;
    HEAP32[263117] = $1_1;
    $4_1 = HEAP32[263119];
    $0_1 = $3_1 + $4_1 | 0;
    HEAP32[263119] = $0_1;
    HEAP32[$0_1 + 4 >> 2] = $1_1 | 1;
    HEAP32[$4_1 + 4 >> 2] = $3_1 | 3;
    break label$1;
   }
   return $5_1;
  }
  return $4_1 + 8 | 0;
 }

 function $1($0_1) {
  var $1_1 = 0, $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0, $11_1 = 0, $12_1 = 0, $13_1 = 0, $14_1 = 0, $15_1 = 0, $16_1 = 0, $17_1 = 0, $18_1 = 0, $19_1 = 0, $20_1 = 0, $21_1 = 0, $22_1 = 0, $23_1 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $1_1 = global$0 - 2016 | 0;
  global$0 = $1_1;
  $13_1 = $0_1 + 96 | 0;
  $16_1 = $1_1 + 1788 | 0;
  $17_1 = $1_1 + 1892 | 0;
  $18_1 = $1_1 + 1896 | 0;
  $12_1 = $1_1 + 496 | 0;
  $20_1 = $1_1 + 1984 | 0;
  $21_1 = $1_1 + 1880 | 0;
  $22_1 = $1_1 + 1776 | 0;
  $23_1 = $1_1 + 400 | 0;
  $14_1 = 1049544;
  $15_1 = 1050216;
  while (1) {
   label$2 : {
    if (($19_1 | 0) != 7) {
     $3_1 = 0;
     while (1) {
      if (($3_1 | 0) != 96) {
       $5_1 = $0_1 + $3_1 | 0;
       $7_1 = $37(HEAP32[$5_1 >> 2], HEAP32[$5_1 + 4 >> 2]);
       $2_1 = i64toi32_i32$HIGH_BITS;
       $4_1 = $37($7_1, $2_1);
       $33($5_1, $13($7_1, $2_1, $4_1, i64toi32_i32$HIGH_BITS), i64toi32_i32$HIGH_BITS);
       $3_1 = $3_1 + 8 | 0;
       continue;
      }
      break;
     };
     $5_1 = $1_1 + 400 | 0;
     $35($5_1, 96);
     $36($1_1 + 496 | 0, 1050888, 1152);
     HEAP32[$1_1 + 1672 >> 2] = 0;
     HEAP32[$1_1 + 1664 >> 2] = 0;
     HEAP32[$1_1 + 1668 >> 2] = 0;
     HEAP32[$1_1 + 1656 >> 2] = $12_1;
     HEAP32[$1_1 + 1648 >> 2] = 0;
     HEAP32[$1_1 + 1652 >> 2] = 12;
     $19_1 = $19_1 + 1 | 0;
     $3_1 = $12_1;
     while (1) {
      label$7 : {
       if (($3_1 | 0) == ($5_1 | 0)) {
        break label$7
       }
       HEAP32[$1_1 + 1660 >> 2] = $5_1 + 8;
       $17($1_1 + 1888 | 0, $1_1 + 496 | 0);
       if (!(HEAP32[$1_1 + 1888 >> 2] | HEAP32[$1_1 + 1892 >> 2])) {
        break label$7
       }
       $3_1 = $1_1 + 1784 | 0;
       $36($3_1, $18_1, 96);
       $36($17_1, $3_1, 96);
       $2_1 = $1_1 + 1680 | 0;
       $4_1 = $1_1 + 1888 | 0;
       $36($2_1, $4_1, 100);
       $36($3_1, $2_1, 100);
       $36($4_1, $16_1, 96);
       HEAP32[$1_1 + 2008 >> 2] = 0;
       HEAP32[$1_1 + 2e3 >> 2] = 0;
       HEAP32[$1_1 + 2004 >> 2] = 0;
       HEAP32[$1_1 + 1992 >> 2] = $13_1;
       HEAP32[$1_1 + 1984 >> 2] = 0;
       HEAP32[$1_1 + 1988 >> 2] = 12;
       $4_1 = HEAP32[$5_1 >> 2];
       $2_1 = HEAP32[$5_1 + 4 >> 2];
       $7_1 = $13_1;
       $3_1 = $0_1;
       while (1) {
        label$9 : {
         if (($3_1 | 0) == ($7_1 | 0)) {
          break label$9
         }
         HEAP32[$1_1 + 1996 >> 2] = $3_1 + 8;
         $18($1_1 + 96 | 0, $1_1 + 1888 | 0);
         if (!HEAP32[$1_1 + 96 >> 2]) {
          break label$9
         }
         $7_1 = $2_1;
         $3_1 = $13(HEAP32[$1_1 + 104 >> 2], HEAP32[$1_1 + 108 >> 2], HEAP32[$3_1 >> 2], HEAP32[$3_1 + 4 >> 2]);
         $2_1 = i64toi32_i32$HIGH_BITS;
         $6_1 = $2_1;
         $9_1 = $3_1 - 1 | 0;
         $2_1 = ($9_1 | 0) != -1 ? $2_1 + 1 | 0 : $2_1;
         $8_1 = $9_1;
         $9_1 = ($6_1 | 0) == -1 & ($3_1 | 0) != 0;
         $3_1 = $9_1 ? $8_1 : $3_1;
         $8_1 = $3_1 + $4_1 | 0;
         $6_1 = ($9_1 ? $2_1 : $6_1) + $7_1 | 0;
         $6_1 = $3_1 >>> 0 > $8_1 >>> 0 ? $6_1 + 1 | 0 : $6_1;
         $2_1 = $6_1;
         $4_1 = (($2_1 | 0) == ($7_1 | 0) & $4_1 >>> 0 > $8_1 >>> 0 | $2_1 >>> 0 < $7_1 >>> 0 ? -1 : 0) + $8_1 | 0;
         $2_1 = $4_1 >>> 0 < $8_1 >>> 0 ? $2_1 + 1 | 0 : $2_1;
         HEAP32[$5_1 >> 2] = $4_1;
         HEAP32[$5_1 + 4 >> 2] = $2_1;
         $7_1 = HEAP32[$1_1 + 1992 >> 2];
         $3_1 = HEAP32[$1_1 + 1996 >> 2];
         continue;
        }
        break;
       };
       $3_1 = HEAP32[$1_1 + 1656 >> 2];
       $5_1 = HEAP32[$1_1 + 1660 >> 2];
       continue;
      }
      break;
     };
     $9_1 = $36($0_1, $1_1 + 400 | 0, 96);
     $3_1 = 0;
     while (1) {
      if (($3_1 | 0) != 96) {
       $4_1 = $3_1 + $9_1 | 0;
       $11_1 = $4_1;
       $5_1 = HEAP32[$4_1 >> 2];
       $7_1 = HEAP32[$4_1 + 4 >> 2];
       $4_1 = $3_1 + $14_1 | 0;
       $2_1 = HEAP32[$4_1 >> 2];
       $4_1 = HEAP32[$4_1 + 4 >> 2];
       $8_1 = $4_1;
       $6_1 = $4_1;
       $4_1 = $2_1 - 1 | 0;
       $6_1 = ($4_1 | 0) != -1 ? $6_1 + 1 | 0 : $6_1;
       $10_1 = $2_1;
       $2_1 = ($8_1 | 0) == -1 & ($2_1 | 0) != 0;
       $4_1 = $2_1 ? $4_1 : $10_1;
       $10_1 = $4_1 + $5_1 | 0;
       $2_1 = ($2_1 ? $6_1 : $8_1) + $7_1 | 0;
       $2_1 = $4_1 >>> 0 > $10_1 >>> 0 ? $2_1 + 1 | 0 : $2_1;
       $4_1 = (($2_1 | 0) == ($7_1 | 0) & $5_1 >>> 0 > $10_1 >>> 0 | $2_1 >>> 0 < $7_1 >>> 0 ? -1 : 0) + $10_1 | 0;
       $6_1 = $4_1 >>> 0 < $10_1 >>> 0 ? $2_1 + 1 | 0 : $2_1;
       HEAP32[$11_1 >> 2] = $4_1;
       HEAP32[$11_1 + 4 >> 2] = $6_1;
       $3_1 = $3_1 + 8 | 0;
       continue;
      }
      break;
     };
     $36($1_1 + 112 | 0, $9_1, 96);
     $3_1 = 0;
     while (1) {
      if (($3_1 | 0) != 96) {
       $2_1 = ($1_1 + 112 | 0) + $3_1 | 0;
       $4_1 = HEAP32[$2_1 >> 2];
       (wasm2js_i32$0 = $2_1, wasm2js_i32$1 = $37($4_1, HEAP32[$2_1 + 4 >> 2])), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
       HEAP32[$2_1 + 4 >> 2] = i64toi32_i32$HIGH_BITS;
       $3_1 = $3_1 + 8 | 0;
       continue;
      }
      break;
     };
     $36($1_1 + 208 | 0, $1_1 + 112 | 0, 96);
     $3_1 = 0;
     while (1) {
      if (($3_1 | 0) != 96) {
       $2_1 = ($1_1 + 208 | 0) + $3_1 | 0;
       $4_1 = HEAP32[$2_1 >> 2];
       (wasm2js_i32$0 = $2_1, wasm2js_i32$1 = $37($4_1, HEAP32[$2_1 + 4 >> 2])), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
       HEAP32[$2_1 + 4 >> 2] = i64toi32_i32$HIGH_BITS;
       $3_1 = $3_1 + 8 | 0;
       continue;
      }
      break;
     };
     $36($1_1 + 304 | 0, $1_1 + 208 | 0, 96);
     $5_1 = 0;
     while (1) {
      label$17 : {
       if (($5_1 | 0) != 3) {
        $3_1 = 0;
        while (1) {
         if (($3_1 | 0) == 96) {
          break label$17
         }
         $2_1 = ($1_1 + 304 | 0) + $3_1 | 0;
         $4_1 = HEAP32[$2_1 >> 2];
         (wasm2js_i32$0 = $2_1, wasm2js_i32$1 = $37($4_1, HEAP32[$2_1 + 4 >> 2])), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
         HEAP32[$2_1 + 4 >> 2] = i64toi32_i32$HIGH_BITS;
         $3_1 = $3_1 + 8 | 0;
         continue;
        };
       }
       $36($1_1 + 496 | 0, $1_1 + 208 | 0, 96);
       HEAP32[$1_1 + 616 >> 2] = 0;
       HEAP32[$1_1 + 608 >> 2] = 0;
       HEAP32[$1_1 + 612 >> 2] = 0;
       HEAP32[$1_1 + 600 >> 2] = $23_1;
       HEAP32[$1_1 + 592 >> 2] = 0;
       HEAP32[$1_1 + 596 >> 2] = 12;
       HEAP32[$1_1 + 604 >> 2] = $1_1 + 304;
       while (1) {
        $14($1_1 + 80 | 0, $1_1 + 496 | 0);
        $2_1 = HEAP32[$1_1 + 80 >> 2];
        if ($2_1) {
         $33($2_1, HEAP32[$1_1 + 88 >> 2], HEAP32[$1_1 + 92 >> 2]);
         continue;
        }
        break;
       };
       $36($1_1 + 400 | 0, $1_1 + 304 | 0, 96);
       $5_1 = 0;
       while (1) {
        label$23 : {
         if (($5_1 | 0) != 6) {
          $3_1 = 0;
          while (1) {
           if (($3_1 | 0) == 96) {
            break label$23
           }
           $2_1 = ($1_1 + 400 | 0) + $3_1 | 0;
           $4_1 = HEAP32[$2_1 >> 2];
           (wasm2js_i32$0 = $2_1, wasm2js_i32$1 = $37($4_1, HEAP32[$2_1 + 4 >> 2])), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
           HEAP32[$2_1 + 4 >> 2] = i64toi32_i32$HIGH_BITS;
           $3_1 = $3_1 + 8 | 0;
           continue;
          };
         }
         $36($1_1 + 496 | 0, $1_1 + 304 | 0, 96);
         HEAP32[$1_1 + 616 >> 2] = 0;
         HEAP32[$1_1 + 608 >> 2] = 0;
         HEAP32[$1_1 + 612 >> 2] = 0;
         HEAP32[$1_1 + 600 >> 2] = $12_1;
         HEAP32[$1_1 + 592 >> 2] = 0;
         HEAP32[$1_1 + 596 >> 2] = 12;
         HEAP32[$1_1 + 604 >> 2] = $1_1 + 400;
         while (1) {
          $14($1_1 - -64 | 0, $1_1 + 496 | 0);
          $2_1 = HEAP32[$1_1 + 64 >> 2];
          if ($2_1) {
           $33($2_1, HEAP32[$1_1 + 72 >> 2], HEAP32[$1_1 + 76 >> 2]);
           continue;
          }
          break;
         };
         $36($1_1 + 1680 | 0, $1_1 + 400 | 0, 96);
         $5_1 = 0;
         while (1) {
          label$29 : {
           if (($5_1 | 0) != 12) {
            $3_1 = 0;
            while (1) {
             if (($3_1 | 0) == 96) {
              break label$29
             }
             $2_1 = ($1_1 + 1680 | 0) + $3_1 | 0;
             $4_1 = HEAP32[$2_1 >> 2];
             (wasm2js_i32$0 = $2_1, wasm2js_i32$1 = $37($4_1, HEAP32[$2_1 + 4 >> 2])), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
             HEAP32[$2_1 + 4 >> 2] = i64toi32_i32$HIGH_BITS;
             $3_1 = $3_1 + 8 | 0;
             continue;
            };
           }
           $36($1_1 + 496 | 0, $1_1 + 400 | 0, 96);
           HEAP32[$1_1 + 616 >> 2] = 0;
           HEAP32[$1_1 + 608 >> 2] = 0;
           HEAP32[$1_1 + 612 >> 2] = 0;
           HEAP32[$1_1 + 600 >> 2] = $22_1;
           HEAP32[$1_1 + 592 >> 2] = 0;
           HEAP32[$1_1 + 596 >> 2] = 12;
           HEAP32[$1_1 + 604 >> 2] = $1_1 + 1680;
           while (1) {
            $14($1_1 + 48 | 0, $1_1 + 496 | 0);
            $2_1 = HEAP32[$1_1 + 48 >> 2];
            if ($2_1) {
             $33($2_1, HEAP32[$1_1 + 56 >> 2], HEAP32[$1_1 + 60 >> 2]);
             continue;
            }
            break;
           };
           $36($1_1 + 1784 | 0, $1_1 + 1680 | 0, 96);
           $5_1 = 0;
           while (1) {
            label$35 : {
             if (($5_1 | 0) != 6) {
              $3_1 = 0;
              while (1) {
               if (($3_1 | 0) == 96) {
                break label$35
               }
               $2_1 = ($1_1 + 1784 | 0) + $3_1 | 0;
               $4_1 = HEAP32[$2_1 >> 2];
               (wasm2js_i32$0 = $2_1, wasm2js_i32$1 = $37($4_1, HEAP32[$2_1 + 4 >> 2])), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
               HEAP32[$2_1 + 4 >> 2] = i64toi32_i32$HIGH_BITS;
               $3_1 = $3_1 + 8 | 0;
               continue;
              };
             }
             $36($1_1 + 496 | 0, $1_1 + 304 | 0, 96);
             HEAP32[$1_1 + 616 >> 2] = 0;
             HEAP32[$1_1 + 608 >> 2] = 0;
             HEAP32[$1_1 + 612 >> 2] = 0;
             HEAP32[$1_1 + 600 >> 2] = $21_1;
             HEAP32[$1_1 + 592 >> 2] = 0;
             HEAP32[$1_1 + 596 >> 2] = 12;
             HEAP32[$1_1 + 604 >> 2] = $1_1 + 1784;
             while (1) {
              $14($1_1 + 32 | 0, $1_1 + 496 | 0);
              $2_1 = HEAP32[$1_1 + 32 >> 2];
              if ($2_1) {
               $33($2_1, HEAP32[$1_1 + 40 >> 2], HEAP32[$1_1 + 44 >> 2]);
               continue;
              }
              break;
             };
             $36($1_1 + 1888 | 0, $1_1 + 1784 | 0, 96);
             $5_1 = 0;
             while (1) {
              label$41 : {
               if (($5_1 | 0) != 31) {
                $3_1 = 0;
                while (1) {
                 if (($3_1 | 0) == 96) {
                  break label$41
                 }
                 $2_1 = ($1_1 + 1888 | 0) + $3_1 | 0;
                 $4_1 = HEAP32[$2_1 >> 2];
                 (wasm2js_i32$0 = $2_1, wasm2js_i32$1 = $37($4_1, HEAP32[$2_1 + 4 >> 2])), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
                 HEAP32[$2_1 + 4 >> 2] = i64toi32_i32$HIGH_BITS;
                 $3_1 = $3_1 + 8 | 0;
                 continue;
                };
               }
               $36($1_1 + 496 | 0, $1_1 + 1784 | 0, 96);
               HEAP32[$1_1 + 616 >> 2] = 0;
               HEAP32[$1_1 + 608 >> 2] = 0;
               HEAP32[$1_1 + 612 >> 2] = 0;
               HEAP32[$1_1 + 600 >> 2] = $20_1;
               HEAP32[$1_1 + 592 >> 2] = 0;
               HEAP32[$1_1 + 596 >> 2] = 12;
               HEAP32[$1_1 + 604 >> 2] = $1_1 + 1888;
               while (1) {
                $14($1_1 + 16 | 0, $1_1 + 496 | 0);
                $2_1 = HEAP32[$1_1 + 16 >> 2];
                if ($2_1) {
                 $33($2_1, HEAP32[$1_1 + 24 >> 2], HEAP32[$1_1 + 28 >> 2]);
                 continue;
                }
                break;
               };
               $3_1 = 0;
               while (1) {
                if (($3_1 | 0) != 96) {
                 $2_1 = ($1_1 + 1888 | 0) + $3_1 | 0;
                 $4_1 = ($1_1 + 1784 | 0) + $3_1 | 0;
                 $7_1 = $37($37($13($37(HEAP32[$2_1 >> 2], HEAP32[$2_1 + 4 >> 2]), i64toi32_i32$HIGH_BITS, HEAP32[$4_1 >> 2], HEAP32[$4_1 + 4 >> 2]), i64toi32_i32$HIGH_BITS), i64toi32_i32$HIGH_BITS);
                 $2_1 = i64toi32_i32$HIGH_BITS;
                 $4_1 = ($1_1 + 112 | 0) + $3_1 | 0;
                 $6_1 = HEAP32[$4_1 >> 2];
                 $8_1 = HEAP32[$4_1 + 4 >> 2];
                 $4_1 = ($1_1 + 208 | 0) + $3_1 | 0;
                 $5_1 = $3_1 + $9_1 | 0;
                 $4_1 = $13($13($6_1, $8_1, HEAP32[$4_1 >> 2], HEAP32[$4_1 + 4 >> 2]), i64toi32_i32$HIGH_BITS, HEAP32[$5_1 >> 2], HEAP32[$5_1 + 4 >> 2]);
                 (wasm2js_i32$0 = $5_1, wasm2js_i32$1 = $13($7_1, $2_1, $4_1, i64toi32_i32$HIGH_BITS)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
                 HEAP32[$5_1 + 4 >> 2] = i64toi32_i32$HIGH_BITS;
                 $3_1 = $3_1 + 8 | 0;
                 continue;
                }
                break;
               };
               $5_1 = $1_1 + 400 | 0;
               $35($5_1, 96);
               $36($1_1 + 496 | 0, 1050888, 1152);
               HEAP32[$1_1 + 1672 >> 2] = 0;
               HEAP32[$1_1 + 1664 >> 2] = 0;
               HEAP32[$1_1 + 1668 >> 2] = 0;
               HEAP32[$1_1 + 1656 >> 2] = $12_1;
               HEAP32[$1_1 + 1648 >> 2] = 0;
               HEAP32[$1_1 + 1652 >> 2] = 12;
               $3_1 = $12_1;
               while (1) {
                label$49 : {
                 if (($3_1 | 0) == ($5_1 | 0)) {
                  break label$49
                 }
                 HEAP32[$1_1 + 1660 >> 2] = $5_1 + 8;
                 $17($1_1 + 1888 | 0, $1_1 + 496 | 0);
                 if (!(HEAP32[$1_1 + 1888 >> 2] | HEAP32[$1_1 + 1892 >> 2])) {
                  break label$49
                 }
                 $3_1 = $1_1 + 1784 | 0;
                 $36($3_1, $18_1, 96);
                 $36($17_1, $3_1, 96);
                 $2_1 = $1_1 + 1680 | 0;
                 $4_1 = $1_1 + 1888 | 0;
                 $36($2_1, $4_1, 100);
                 $36($3_1, $2_1, 100);
                 $36($4_1, $16_1, 96);
                 HEAP32[$1_1 + 2008 >> 2] = 0;
                 HEAP32[$1_1 + 2e3 >> 2] = 0;
                 HEAP32[$1_1 + 2004 >> 2] = 0;
                 HEAP32[$1_1 + 1992 >> 2] = $13_1;
                 HEAP32[$1_1 + 1984 >> 2] = 0;
                 HEAP32[$1_1 + 1988 >> 2] = 12;
                 $4_1 = HEAP32[$5_1 >> 2];
                 $2_1 = HEAP32[$5_1 + 4 >> 2];
                 $7_1 = $13_1;
                 $3_1 = $9_1;
                 while (1) {
                  label$51 : {
                   if (($3_1 | 0) == ($7_1 | 0)) {
                    break label$51
                   }
                   HEAP32[$1_1 + 1996 >> 2] = $3_1 + 8;
                   $18($1_1, $1_1 + 1888 | 0);
                   if (!HEAP32[$1_1 >> 2]) {
                    break label$51
                   }
                   $7_1 = $2_1;
                   $3_1 = $13(HEAP32[$1_1 + 8 >> 2], HEAP32[$1_1 + 12 >> 2], HEAP32[$3_1 >> 2], HEAP32[$3_1 + 4 >> 2]);
                   $2_1 = i64toi32_i32$HIGH_BITS;
                   $8_1 = $2_1;
                   $6_1 = $3_1 - 1 | 0;
                   $2_1 = ($6_1 | 0) != -1 ? $2_1 + 1 | 0 : $2_1;
                   $11_1 = $6_1;
                   $6_1 = ($8_1 | 0) == -1 & ($3_1 | 0) != 0;
                   $3_1 = $6_1 ? $11_1 : $3_1;
                   $11_1 = $3_1 + $4_1 | 0;
                   $6_1 = ($6_1 ? $2_1 : $8_1) + $7_1 | 0;
                   $6_1 = $3_1 >>> 0 > $11_1 >>> 0 ? $6_1 + 1 | 0 : $6_1;
                   $2_1 = $6_1;
                   $4_1 = (($2_1 | 0) == ($7_1 | 0) & $4_1 >>> 0 > $11_1 >>> 0 | $2_1 >>> 0 < $7_1 >>> 0 ? -1 : 0) + $11_1 | 0;
                   $2_1 = $4_1 >>> 0 < $11_1 >>> 0 ? $2_1 + 1 | 0 : $2_1;
                   HEAP32[$5_1 >> 2] = $4_1;
                   HEAP32[$5_1 + 4 >> 2] = $2_1;
                   $7_1 = HEAP32[$1_1 + 1992 >> 2];
                   $3_1 = HEAP32[$1_1 + 1996 >> 2];
                   continue;
                  }
                  break;
                 };
                 $3_1 = HEAP32[$1_1 + 1656 >> 2];
                 $5_1 = HEAP32[$1_1 + 1660 >> 2];
                 continue;
                }
                break;
               };
               $9_1 = $36($9_1, $1_1 + 400 | 0, 96);
               $3_1 = 0;
               while (1) {
                if (($3_1 | 0) == 96) {
                 break label$2
                }
                $4_1 = $3_1 + $9_1 | 0;
                $11_1 = $4_1;
                $5_1 = HEAP32[$4_1 >> 2];
                $7_1 = HEAP32[$4_1 + 4 >> 2];
                $4_1 = $3_1 + $15_1 | 0;
                $2_1 = HEAP32[$4_1 >> 2];
                $4_1 = HEAP32[$4_1 + 4 >> 2];
                $8_1 = $4_1;
                $6_1 = $4_1;
                $4_1 = $2_1 - 1 | 0;
                $6_1 = ($4_1 | 0) != -1 ? $6_1 + 1 | 0 : $6_1;
                $10_1 = $2_1;
                $2_1 = ($8_1 | 0) == -1 & ($2_1 | 0) != 0;
                $4_1 = $2_1 ? $4_1 : $10_1;
                $10_1 = $4_1 + $5_1 | 0;
                $2_1 = ($2_1 ? $6_1 : $8_1) + $7_1 | 0;
                $2_1 = $4_1 >>> 0 > $10_1 >>> 0 ? $2_1 + 1 | 0 : $2_1;
                $4_1 = (($2_1 | 0) == ($7_1 | 0) & $5_1 >>> 0 > $10_1 >>> 0 | $2_1 >>> 0 < $7_1 >>> 0 ? -1 : 0) + $10_1 | 0;
                $6_1 = $4_1 >>> 0 < $10_1 >>> 0 ? $2_1 + 1 | 0 : $2_1;
                HEAP32[$11_1 >> 2] = $4_1;
                HEAP32[$11_1 + 4 >> 2] = $6_1;
                $3_1 = $3_1 + 8 | 0;
                continue;
               };
              }
              $5_1 = $5_1 + 1 | 0;
              continue;
             };
            }
            $5_1 = $5_1 + 1 | 0;
            continue;
           };
          }
          $5_1 = $5_1 + 1 | 0;
          continue;
         };
        }
        $5_1 = $5_1 + 1 | 0;
        continue;
       };
      }
      $5_1 = $5_1 + 1 | 0;
      continue;
     };
    }
    global$0 = $1_1 + 2016 | 0;
    return;
   }
   $15_1 = $15_1 + 96 | 0;
   $14_1 = $14_1 + 96 | 0;
   continue;
  };
 }

 function $2($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0, $11_1 = 0, $12_1 = 0, $13_1 = 0, $14_1 = 0;
  $3_1 = global$0 - 144 | 0;
  global$0 = $3_1;
  HEAP32[$3_1 + 80 >> 2] = $2_1;
  HEAP32[$3_1 + 76 >> 2] = $1_1;
  HEAP32[$3_1 + 72 >> 2] = $2_1;
  $16($3_1 + 16 | 0, $3_1 + 72 | 0);
  $2_1 = HEAP32[$3_1 + 16 >> 2];
  $1_1 = HEAP32[$3_1 + 20 >> 2];
  HEAP32[$3_1 + 32 >> 2] = $1_1;
  HEAP32[$3_1 + 28 >> 2] = $2_1;
  HEAP32[$3_1 + 24 >> 2] = $1_1;
  label$1 : {
   if ($1_1 >>> 0 <= 7) {
    $6_1 = 1;
    while (1) {
     $23($3_1 + 24 | 0, $6_1);
     $6_1 = 0;
     $1_1 = HEAP32[$3_1 + 32 >> 2];
     if ($1_1 >>> 0 < 8) {
      continue
     }
     break;
    };
    break label$1;
   }
   label$4 : {
    switch ($1_1 & 3) {
    case 3:
     $23($3_1 + 24 | 0, 1);
     $1_1 = HEAP32[$3_1 + 32 >> 2];
     break label$1;
    case 0:
     break label$1;
    default:
     break label$4;
    };
   }
   $6_1 = 1;
   while (1) {
    $23($3_1 + 24 | 0, $6_1);
    $6_1 = 0;
    $1_1 = HEAP32[$3_1 + 32 >> 2];
    if ($1_1 & 3) {
     continue
    }
    break;
   };
  }
  label$7 : {
   label$8 : {
    label$9 : {
     label$10 : {
      if (!($1_1 & 3 | $1_1 >>> 0 < 9 ? ($1_1 | 0) != 8 : 0)) {
       $5_1 = HEAP32[$3_1 + 24 >> 2];
       $6_1 = HEAP32[$3_1 + 28 >> 2];
       HEAP32[$3_1 + 72 >> 2] = 0;
       HEAP32[$3_1 + 76 >> 2] = 8;
       $2_1 = 0;
       $10_1 = $6_1;
       $11_1 = 8;
       while (1) {
        HEAP32[$3_1 + 80 >> 2] = $2_1;
        if ($1_1) {
         $7_1 = HEAP32[$10_1 + 4 >> 2];
         $4_1 = $7_1;
         $8_1 = HEAP32[$10_1 >> 2];
         $9_1 = $8_1 - 1 | 0;
         $4_1 = ($9_1 | 0) != -1 ? $4_1 + 1 | 0 : $4_1;
         $12_1 = $9_1;
         $9_1 = !$8_1 & ($7_1 | 0) == -1 | ($7_1 | 0) != -1;
         $8_1 = $9_1 ? $8_1 : $12_1;
         $4_1 = $9_1 ? $7_1 : $4_1;
         if (HEAP32[$3_1 + 72 >> 2] == ($2_1 | 0)) {
          $7_1 = global$0 - 16 | 0;
          global$0 = $7_1;
          $11($7_1 + 8 | 0, $3_1 + 72 | 0, $2_1, 1);
          $29(HEAP32[$7_1 + 12 >> 2]);
          global$0 = $7_1 + 16 | 0;
          $11_1 = HEAP32[$3_1 + 76 >> 2];
          $2_1 = HEAP32[$3_1 + 80 >> 2];
         }
         $2_1 = ($2_1 << 3) + $11_1 | 0;
         HEAP32[$2_1 >> 2] = $8_1;
         HEAP32[$2_1 + 4 >> 2] = $4_1;
         $1_1 = $1_1 - 1 | 0;
         $10_1 = $10_1 + 8 | 0;
         $2_1 = HEAP32[$3_1 + 80 >> 2] + 1 | 0;
         continue;
        }
        break;
       };
       HEAP32[$3_1 + 48 >> 2] = HEAP32[$3_1 + 80 >> 2];
       $1_1 = HEAP32[$3_1 + 76 >> 2];
       HEAP32[$3_1 + 40 >> 2] = HEAP32[$3_1 + 72 >> 2];
       HEAP32[$3_1 + 44 >> 2] = $1_1;
       if ($5_1) {
        $32($6_1, $5_1 << 3)
       }
       $2_1 = HEAP32[$3_1 + 48 >> 2];
       if (($2_1 | 0) != 8) {
        break label$10
       }
       $2_1 = 8;
       break label$9;
      }
      HEAP32[$3_1 + 84 >> 2] = 1;
      HEAP32[$3_1 + 92 >> 2] = 1;
      HEAP32[$3_1 + 80 >> 2] = 1049340;
      HEAP32[$3_1 + 72 >> 2] = 0;
      HEAP32[$3_1 + 124 >> 2] = 1;
      HEAP32[$3_1 + 104 >> 2] = $1_1;
      HEAP32[$3_1 + 88 >> 2] = $3_1 + 120;
      HEAP32[$3_1 + 120 >> 2] = $3_1 + 104;
      $26($3_1 + 72 | 0, 1049436);
      wasm2js_trap();
     }
     $4_1 = ($2_1 >>> 2 | 0) - 1 | 0;
     if (($4_1 | 0) != 1) {
      break label$8
     }
    }
    $9($3_1 + 72 | 0, HEAP32[$3_1 + 44 >> 2], $2_1);
    $6_1 = HEAP32[$3_1 + 96 >> 2];
    $5_1 = HEAP32[$3_1 + 100 >> 2];
    $8_1 = HEAP32[$3_1 + 88 >> 2];
    $11_1 = HEAP32[$3_1 + 92 >> 2];
    $7_1 = HEAP32[$3_1 + 80 >> 2];
    $9_1 = HEAP32[$3_1 + 84 >> 2];
    $2_1 = HEAP32[$3_1 + 72 >> 2];
    $10_1 = HEAP32[$3_1 + 76 >> 2];
    break label$7;
   }
   $1_1 = $3_1 + 72 | 0;
   $19($1_1, $3_1 + 40 | 0, $2_1 - 8 | 0);
   $12($3_1 + 56 | 0, $1_1);
   $13_1 = HEAP32[$3_1 + 60 >> 2];
   $9($1_1, $13_1, HEAP32[$3_1 + 64 >> 2]);
   $10_1 = ($4_1 >>> 0 <= 1 ? 1 : $4_1) - 1 | 0;
   while (1) {
    if ($10_1) {
     $15($3_1 + 8 | 0, 4);
     $1_1 = $3_1 + 80 | 0;
     $11_1 = HEAP32[$1_1 >> 2];
     $9_1 = HEAP32[$1_1 + 4 >> 2];
     $1_1 = $3_1 + 88 | 0;
     $6_1 = HEAP32[$1_1 >> 2];
     $8_1 = HEAP32[$1_1 + 4 >> 2];
     $1_1 = $3_1 + 96 | 0;
     $4_1 = HEAP32[$1_1 >> 2];
     $2_1 = HEAP32[$1_1 + 4 >> 2];
     $7_1 = HEAP32[$3_1 + 8 >> 2];
     $1_1 = HEAP32[$3_1 + 76 >> 2];
     $12_1 = HEAP32[$3_1 + 12 >> 2];
     $5_1 = $12_1;
     HEAP32[$5_1 >> 2] = HEAP32[$3_1 + 72 >> 2];
     HEAP32[$5_1 + 4 >> 2] = $1_1;
     $14_1 = $5_1 + 24 | 0;
     $1_1 = $14_1;
     HEAP32[$1_1 >> 2] = $4_1;
     HEAP32[$1_1 + 4 >> 2] = $2_1;
     $5_1 = $5_1 + 16 | 0;
     $1_1 = $5_1;
     HEAP32[$1_1 >> 2] = $6_1;
     HEAP32[$1_1 + 4 >> 2] = $8_1;
     $6_1 = $12_1 + 8 | 0;
     $1_1 = $6_1;
     HEAP32[$1_1 >> 2] = $11_1;
     HEAP32[$1_1 + 4 >> 2] = $9_1;
     $2_1 = $3_1 + 120 | 0;
     $19($2_1, $3_1 + 40 | 0, HEAP32[$3_1 + 48 >> 2] - 4 | 0);
     $1_1 = $3_1 + 104 | 0;
     $12($1_1, $2_1);
     $21($1_1, 4);
     $1_1 = HEAP32[$12_1 + 4 >> 2];
     $8_1 = HEAP32[$3_1 + 108 >> 2];
     $4_1 = HEAP32[$3_1 + 112 >> 2];
     $9_1 = $8_1 + ($4_1 << 3) | 0;
     $2_1 = $9_1;
     HEAP32[$2_1 >> 2] = HEAP32[$12_1 >> 2];
     HEAP32[$2_1 + 4 >> 2] = $1_1;
     $1_1 = HEAP32[$6_1 + 4 >> 2];
     $2_1 = $2_1 + 8 | 0;
     HEAP32[$2_1 >> 2] = HEAP32[$6_1 >> 2];
     HEAP32[$2_1 + 4 >> 2] = $1_1;
     $1_1 = HEAP32[$5_1 + 4 >> 2];
     $2_1 = $9_1 + 16 | 0;
     HEAP32[$2_1 >> 2] = HEAP32[$5_1 >> 2];
     HEAP32[$2_1 + 4 >> 2] = $1_1;
     $1_1 = HEAP32[$14_1 + 4 >> 2];
     $2_1 = $9_1 + 24 | 0;
     HEAP32[$2_1 >> 2] = HEAP32[$14_1 >> 2];
     HEAP32[$2_1 + 4 >> 2] = $1_1;
     $1_1 = $4_1 + 4 | 0;
     HEAP32[$3_1 + 112 >> 2] = $1_1;
     $9($3_1 + 72 | 0, $8_1, $1_1);
     $31(HEAP32[$3_1 + 104 >> 2], $8_1);
     $31($7_1, $12_1);
     $10_1 = $10_1 - 1 | 0;
     continue;
    } else {
     $6_1 = HEAP32[$3_1 + 96 >> 2];
     $5_1 = HEAP32[$3_1 + 100 >> 2];
     $8_1 = HEAP32[$3_1 + 88 >> 2];
     $11_1 = HEAP32[$3_1 + 92 >> 2];
     $7_1 = HEAP32[$3_1 + 80 >> 2];
     $9_1 = HEAP32[$3_1 + 84 >> 2];
     $2_1 = HEAP32[$3_1 + 72 >> 2];
     $10_1 = HEAP32[$3_1 + 76 >> 2];
     $31(HEAP32[$3_1 + 56 >> 2], $13_1);
    }
    break;
   };
  }
  $1_1 = $0(32);
  if ($1_1) {
   $4_1 = $10_1;
   $13_1 = $2_1 - 1 | 0;
   $4_1 = ($13_1 | 0) != -1 ? $4_1 + 1 | 0 : $4_1;
   $12_1 = $2_1;
   $2_1 = ($10_1 | 0) == -1 & ($2_1 | 0) != 0;
   HEAP32[$1_1 >> 2] = $2_1 ? $13_1 : $12_1;
   HEAP32[$1_1 + 4 >> 2] = $2_1 ? $4_1 : $10_1;
   $4_1 = $5_1;
   $2_1 = $6_1 - 1 | 0;
   $4_1 = ($2_1 | 0) != -1 ? $4_1 + 1 | 0 : $4_1;
   $10_1 = $2_1;
   $2_1 = ($5_1 | 0) == -1 & ($6_1 | 0) != 0;
   HEAP32[$1_1 + 24 >> 2] = $2_1 ? $10_1 : $6_1;
   HEAP32[$1_1 + 28 >> 2] = $2_1 ? $4_1 : $5_1;
   $4_1 = $11_1;
   $2_1 = $8_1 - 1 | 0;
   $4_1 = ($2_1 | 0) != -1 ? $4_1 + 1 | 0 : $4_1;
   $5_1 = $2_1;
   $2_1 = ($11_1 | 0) == -1 & ($8_1 | 0) != 0;
   HEAP32[$1_1 + 16 >> 2] = $2_1 ? $5_1 : $8_1;
   HEAP32[$1_1 + 20 >> 2] = $2_1 ? $4_1 : $11_1;
   $4_1 = $9_1;
   $2_1 = $7_1 - 1 | 0;
   $4_1 = ($2_1 | 0) != -1 ? $4_1 + 1 | 0 : $4_1;
   $5_1 = $2_1;
   $2_1 = ($9_1 | 0) == -1 & ($7_1 | 0) != 0;
   HEAP32[$1_1 + 8 >> 2] = $2_1 ? $5_1 : $7_1;
   HEAP32[$1_1 + 12 >> 2] = $2_1 ? $4_1 : $9_1;
   $31(HEAP32[$3_1 + 40 >> 2], HEAP32[$3_1 + 44 >> 2]);
   HEAP32[$3_1 + 80 >> 2] = 4;
   HEAP32[$3_1 + 76 >> 2] = $1_1;
   HEAP32[$3_1 + 72 >> 2] = 4;
   $16($3_1, $3_1 + 72 | 0);
   $1_1 = HEAP32[$3_1 + 4 >> 2];
   HEAP32[$0_1 >> 2] = HEAP32[$3_1 >> 2];
   HEAP32[$0_1 + 4 >> 2] = $1_1;
   global$0 = $3_1 + 144 | 0;
   return;
  }
  wasm2js_trap();
 }

 function $3($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0, $11_1 = 0, $12_1 = 0, $13_1 = 0, $14_1 = 0, $15_1 = 0;
  $10_1 = global$0 - 48 | 0;
  global$0 = $10_1;
  $3_1 = 39;
  $0_1 = HEAP32[$0_1 >> 2];
  label$1 : {
   if ($0_1 >>> 0 < 1e4) {
    $2_1 = $0_1;
    break label$1;
   }
   while (1) {
    $12_1 = ($10_1 + 9 | 0) + $3_1 | 0;
    $13_1 = $12_1 - 4 | 0;
    $9_1 = 0;
    __inlined_func$_ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E : {
     if (!$8_1) {
      i64toi32_i32$HIGH_BITS = 0;
      $2_1 = ($0_1 >>> 0) / 1e4 | 0;
      break __inlined_func$_ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E;
     }
     $4_1 = 51 - Math_clz32($8_1) | 0;
     $6_1 = 0 - $4_1 | 0;
     $7_1 = $4_1 & 63;
     $2_1 = $7_1 & 31;
     if ($7_1 >>> 0 >= 32) {
      $7_1 = 0;
      $5_1 = $8_1 >>> $2_1 | 0;
     } else {
      $7_1 = $8_1 >>> $2_1 | 0;
      $5_1 = ((1 << $2_1) - 1 & $8_1) << 32 - $2_1 | $0_1 >>> $2_1;
     }
     $6_1 = $6_1 & 63;
     $2_1 = $6_1 & 31;
     if ($6_1 >>> 0 >= 32) {
      $6_1 = $0_1 << $2_1;
      $2_1 = 0;
     } else {
      $6_1 = (1 << $2_1) - 1 & $0_1 >>> 32 - $2_1 | $8_1 << $2_1;
      $2_1 = $0_1 << $2_1;
     }
     if ($4_1) {
      while (1) {
       $14_1 = $7_1 << 1 | $5_1 >>> 31;
       $7_1 = $5_1 << 1 | $6_1 >>> 31;
       $11_1 = 0 - ($14_1 + ($7_1 >>> 0 > 9999) | 0) >> 31;
       $15_1 = $11_1 & 1e4;
       $5_1 = $7_1 - $15_1 | 0;
       $7_1 = $14_1 - ($7_1 >>> 0 < $15_1 >>> 0) | 0;
       $6_1 = $6_1 << 1 | $2_1 >>> 31;
       $2_1 = $9_1 | $2_1 << 1;
       $9_1 = $11_1 & 1;
       $4_1 = $4_1 - 1 | 0;
       if ($4_1) {
        continue
       }
       break;
      }
     }
     i64toi32_i32$HIGH_BITS = $6_1 << 1 | $2_1 >>> 31;
     $2_1 = $9_1 | $2_1 << 1;
    }
    $6_1 = i64toi32_i32$HIGH_BITS;
    $4_1 = __wasm_i64_mul($2_1, $6_1, 55536, 0) + $0_1 | 0;
    $7_1 = (($4_1 & 65535) >>> 0) / 100 | 0;
    $5_1 = ($7_1 << 1) + 1048732 | 0;
    $5_1 = HEAPU8[$5_1 | 0] | HEAPU8[$5_1 + 1 | 0] << 8;
    HEAP8[$13_1 | 0] = $5_1;
    HEAP8[$13_1 + 1 | 0] = $5_1 >>> 8;
    $5_1 = $12_1 - 2 | 0;
    $4_1 = (($4_1 + Math_imul($7_1, -100) & 65535) << 1) + 1048732 | 0;
    $4_1 = HEAPU8[$4_1 | 0] | HEAPU8[$4_1 + 1 | 0] << 8;
    HEAP8[$5_1 | 0] = $4_1;
    HEAP8[$5_1 + 1 | 0] = $4_1 >>> 8;
    $3_1 = $3_1 - 4 | 0;
    $4_1 = !$8_1 & $0_1 >>> 0 > 99999999 | ($8_1 | 0) != 0;
    $0_1 = $2_1;
    $8_1 = $6_1;
    if ($4_1) {
     continue
    }
    break;
   };
  }
  $0_1 = $2_1;
  if ($2_1 >>> 0 > 99) {
   $3_1 = $3_1 - 2 | 0;
   $8_1 = $3_1 + ($10_1 + 9 | 0) | 0;
   $0_1 = (($2_1 & 65535) >>> 0) / 100 | 0;
   $2_1 = (($2_1 + Math_imul($0_1, -100) & 65535) << 1) + 1048732 | 0;
   $2_1 = HEAPU8[$2_1 | 0] | HEAPU8[$2_1 + 1 | 0] << 8;
   HEAP8[$8_1 | 0] = $2_1;
   HEAP8[$8_1 + 1 | 0] = $2_1 >>> 8;
  }
  label$5 : {
   if ($0_1 >>> 0 >= 10) {
    $3_1 = $3_1 - 2 | 0;
    $2_1 = $3_1 + ($10_1 + 9 | 0) | 0;
    $0_1 = ($0_1 << 1) + 1048732 | 0;
    $0_1 = HEAPU8[$0_1 | 0] | HEAPU8[$0_1 + 1 | 0] << 8;
    HEAP8[$2_1 | 0] = $0_1;
    HEAP8[$2_1 + 1 | 0] = $0_1 >>> 8;
    break label$5;
   }
   $3_1 = $3_1 - 1 | 0;
   HEAP8[$3_1 + ($10_1 + 9 | 0) | 0] = $0_1 + 48;
  }
  $8_1 = 39 - $3_1 | 0;
  $0_1 = 1;
  $2_1 = HEAP32[$1_1 + 24 >> 2];
  $5_1 = $2_1 & 1;
  $6_1 = $5_1 ? 43 : 1114112;
  $4_1 = $2_1 << 29 >> 31 & 1049456;
  $7_1 = ($10_1 + 9 | 0) + $3_1 | 0;
  label$71 : {
   if (!HEAP32[$1_1 + 8 >> 2]) {
    $2_1 = HEAP32[$1_1 >> 2];
    $1_1 = HEAP32[$1_1 + 4 >> 2];
    if ($24($2_1, $1_1, $6_1, $4_1)) {
     break label$71
    }
    $0_1 = FUNCTION_TABLE[HEAP32[$1_1 + 12 >> 2]]($2_1, $7_1, $8_1) | 0;
    break label$71;
   }
   label$92 : {
    label$10 : {
     label$113 : {
      label$12 : {
       $9_1 = HEAP32[$1_1 + 12 >> 2];
       $0_1 = $5_1 + $8_1 | 0;
       if ($9_1 >>> 0 > $0_1 >>> 0) {
        if ($2_1 & 8) {
         break label$92
        }
        $0_1 = $9_1 - $0_1 | 0;
        $2_1 = $0_1;
        $3_1 = HEAPU8[$1_1 + 32 | 0];
        $3_1 = (($3_1 | 0) == 3 ? 1 : $3_1) & 3;
        switch ($3_1 - 1 | 0) {
        case 1:
         break label$113;
        case 0:
         break label$12;
        default:
         break label$10;
        };
       }
       $0_1 = 1;
       $2_1 = HEAP32[$1_1 >> 2];
       $1_1 = HEAP32[$1_1 + 4 >> 2];
       if ($24($2_1, $1_1, $6_1, $4_1)) {
        break label$71
       }
       $0_1 = FUNCTION_TABLE[HEAP32[$1_1 + 12 >> 2]]($2_1, $7_1, $8_1) | 0;
       break label$71;
      }
      $2_1 = 0;
      $3_1 = $0_1;
      break label$10;
     }
     $3_1 = $0_1 >>> 1 | 0;
     $2_1 = $0_1 + 1 >>> 1 | 0;
    }
    $3_1 = $3_1 + 1 | 0;
    $5_1 = HEAP32[$1_1 + 4 >> 2];
    $9_1 = HEAP32[$1_1 + 28 >> 2];
    $1_1 = HEAP32[$1_1 >> 2];
    label$14 : {
     while (1) {
      $3_1 = $3_1 - 1 | 0;
      if (!$3_1) {
       break label$14
      }
      if (!(FUNCTION_TABLE[HEAP32[$5_1 + 16 >> 2]]($1_1, $9_1) | 0)) {
       continue
      }
      break;
     };
     $0_1 = 1;
     break label$71;
    }
    $0_1 = 1;
    if (($9_1 | 0) == 1114112) {
     break label$71
    }
    if ($24($1_1, $5_1, $6_1, $4_1)) {
     break label$71
    }
    if (FUNCTION_TABLE[HEAP32[$5_1 + 12 >> 2]]($1_1, $7_1, $8_1) | 0) {
     break label$71
    }
    $3_1 = 0;
    label$16 : {
     while (1) {
      $0_1 = $2_1;
      if (($2_1 | 0) == ($3_1 | 0)) {
       break label$16
      }
      $3_1 = $3_1 + 1 | 0;
      if (!(FUNCTION_TABLE[HEAP32[$5_1 + 16 >> 2]]($1_1, $9_1) | 0)) {
       continue
      }
      break;
     };
     $0_1 = $3_1 - 1 | 0;
    }
    $0_1 = $0_1 >>> 0 < $2_1 >>> 0;
    break label$71;
   }
   $12_1 = HEAP32[$1_1 + 28 >> 2];
   HEAP32[$1_1 + 28 >> 2] = 48;
   $13_1 = HEAPU8[$1_1 + 32 | 0];
   $0_1 = 1;
   HEAP8[$1_1 + 32 | 0] = 1;
   $2_1 = HEAP32[$1_1 >> 2];
   $11_1 = HEAP32[$1_1 + 4 >> 2];
   if ($24($2_1, $11_1, $6_1, $4_1)) {
    break label$71
   }
   $3_1 = (($3_1 + $9_1 | 0) - $5_1 | 0) - 38 | 0;
   while (1) {
    $3_1 = $3_1 - 1 | 0;
    if ($3_1) {
     if (!(FUNCTION_TABLE[HEAP32[$11_1 + 16 >> 2]]($2_1, 48) | 0)) {
      continue
     }
     break label$71;
    }
    break;
   };
   if (FUNCTION_TABLE[HEAP32[$11_1 + 12 >> 2]]($2_1, $7_1, $8_1) | 0) {
    break label$71
   }
   HEAP8[$1_1 + 32 | 0] = $13_1;
   HEAP32[$1_1 + 28 >> 2] = $12_1;
   $0_1 = 0;
  }
  global$0 = $10_1 + 48 | 0;
  return $0_1 | 0;
 }

 function $4($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  label$1 : {
   if ($1_1 >>> 0 > 4294901708) {
    break label$1
   }
   $2_1 = $1_1 >>> 0 < 11 ? 16 : $1_1 + 11 & -8;
   $5_1 = $0_1 - 4 | 0;
   $6_1 = HEAP32[$5_1 >> 2];
   $4_1 = $6_1 & -8;
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         if ($6_1 & 3) {
          $8_1 = $0_1 - 8 | 0;
          if ($2_1 >>> 0 <= $4_1 >>> 0) {
           break label$7
          }
          $7_1 = $4_1 + $8_1 | 0;
          if (($7_1 | 0) == HEAP32[263119]) {
           break label$6
          }
          if (($7_1 | 0) == HEAP32[263118]) {
           break label$5
          }
          $6_1 = HEAP32[$7_1 + 4 >> 2];
          if ($6_1 & 2) {
           break label$2
          }
          $9_1 = $6_1 & -8;
          $4_1 = $4_1 + $9_1 | 0;
          if ($4_1 >>> 0 >= $2_1 >>> 0) {
           break label$4
          }
          break label$2;
         }
         if ($2_1 >>> 0 < 256 | $4_1 >>> 0 < ($2_1 | 4) >>> 0 | $4_1 - $2_1 >>> 0 >= 131073) {
          break label$2
         }
         break label$3;
        }
        $1_1 = $4_1 - $2_1 | 0;
        if ($1_1 >>> 0 < 16) {
         break label$3
        }
        HEAP32[$5_1 >> 2] = $2_1 | $6_1 & 1 | 2;
        $3_1 = $2_1 + $8_1 | 0;
        HEAP32[$3_1 + 4 >> 2] = $1_1 | 3;
        $2_1 = $1_1 + $3_1 | 0;
        HEAP32[$2_1 + 4 >> 2] = HEAP32[$2_1 + 4 >> 2] | 1;
        $6($3_1, $1_1);
        break label$3;
       }
       $4_1 = $4_1 + HEAP32[263117] | 0;
       if ($4_1 >>> 0 <= $2_1 >>> 0) {
        break label$2
       }
       HEAP32[$5_1 >> 2] = $2_1 | $6_1 & 1 | 2;
       $1_1 = $2_1 + $8_1 | 0;
       $3_1 = $4_1 - $2_1 | 0;
       HEAP32[$1_1 + 4 >> 2] = $3_1 | 1;
       HEAP32[263117] = $3_1;
       HEAP32[263119] = $1_1;
       break label$3;
      }
      $4_1 = $4_1 + HEAP32[263116] | 0;
      if ($4_1 >>> 0 < $2_1 >>> 0) {
       break label$2
      }
      $1_1 = $4_1 - $2_1 | 0;
      label$9 : {
       if ($1_1 >>> 0 <= 15) {
        HEAP32[$5_1 >> 2] = $4_1 | $6_1 & 1 | 2;
        $1_1 = $4_1 + $8_1 | 0;
        HEAP32[$1_1 + 4 >> 2] = HEAP32[$1_1 + 4 >> 2] | 1;
        $1_1 = 0;
        break label$9;
       }
       HEAP32[$5_1 >> 2] = $2_1 | $6_1 & 1 | 2;
       $3_1 = $2_1 + $8_1 | 0;
       HEAP32[$3_1 + 4 >> 2] = $1_1 | 1;
       $2_1 = $1_1 + $3_1 | 0;
       HEAP32[$2_1 >> 2] = $1_1;
       HEAP32[$2_1 + 4 >> 2] = HEAP32[$2_1 + 4 >> 2] & -2;
      }
      HEAP32[263118] = $3_1;
      HEAP32[263116] = $1_1;
      break label$3;
     }
     $1_1 = $4_1 - $2_1 | 0;
     label$11 : {
      if ($9_1 >>> 0 >= 256) {
       $7($7_1);
       break label$11;
      }
      $3_1 = HEAP32[$7_1 + 12 >> 2];
      $7_1 = HEAP32[$7_1 + 8 >> 2];
      if (($3_1 | 0) != ($7_1 | 0)) {
       HEAP32[$7_1 + 12 >> 2] = $3_1;
       HEAP32[$3_1 + 8 >> 2] = $7_1;
       break label$11;
      }
      (wasm2js_i32$0 = 1052456, wasm2js_i32$1 = HEAP32[263114] & __wasm_rotl_i32($6_1 >>> 3 | 0)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
     }
     if ($1_1 >>> 0 >= 16) {
      HEAP32[$5_1 >> 2] = $2_1 | HEAP32[$5_1 >> 2] & 1 | 2;
      $3_1 = $2_1 + $8_1 | 0;
      HEAP32[$3_1 + 4 >> 2] = $1_1 | 3;
      $2_1 = $1_1 + $3_1 | 0;
      HEAP32[$2_1 + 4 >> 2] = HEAP32[$2_1 + 4 >> 2] | 1;
      $6($3_1, $1_1);
      break label$3;
     }
     HEAP32[$5_1 >> 2] = $4_1 | HEAP32[$5_1 >> 2] & 1 | 2;
     $1_1 = $4_1 + $8_1 | 0;
     HEAP32[$1_1 + 4 >> 2] = HEAP32[$1_1 + 4 >> 2] | 1;
    }
    $3_1 = $0_1;
    break label$1;
   }
   $2_1 = $0($1_1);
   if (!$2_1) {
    break label$1
   }
   $3_1 = HEAP32[$5_1 >> 2];
   $3_1 = ($3_1 & 3 ? -4 : -8) + ($3_1 & -8) | 0;
   $1_1 = $36($2_1, $0_1, $1_1 >>> 0 > $3_1 >>> 0 ? $3_1 : $1_1);
   $5($0_1);
   return $1_1;
  }
  return $3_1;
 }

 function $5($0_1) {
  var $1_1 = 0, $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $1_1 = $0_1 - 8 | 0;
  $3_1 = HEAP32[$0_1 - 4 >> 2];
  $0_1 = $3_1 & -8;
  $2_1 = $1_1 + $0_1 | 0;
  label$1 : {
   label$2 : {
    label$3 : {
     if ($3_1 & 1) {
      break label$3
     }
     if (!($3_1 & 3)) {
      break label$2
     }
     $3_1 = HEAP32[$1_1 >> 2];
     $0_1 = $3_1 + $0_1 | 0;
     $1_1 = $1_1 - $3_1 | 0;
     if (($1_1 | 0) == HEAP32[263118]) {
      if ((HEAP32[$2_1 + 4 >> 2] & 3) != 3) {
       break label$3
      }
      HEAP32[263116] = $0_1;
      HEAP32[$2_1 + 4 >> 2] = HEAP32[$2_1 + 4 >> 2] & -2;
      HEAP32[$1_1 + 4 >> 2] = $0_1 | 1;
      HEAP32[$0_1 + $1_1 >> 2] = $0_1;
      return;
     }
     if ($3_1 >>> 0 >= 256) {
      $7($1_1);
      break label$3;
     }
     $4_1 = HEAP32[$1_1 + 8 >> 2];
     $5_1 = HEAP32[$1_1 + 12 >> 2];
     if (($4_1 | 0) != ($5_1 | 0)) {
      HEAP32[$4_1 + 12 >> 2] = $5_1;
      HEAP32[$5_1 + 8 >> 2] = $4_1;
      break label$3;
     }
     (wasm2js_i32$0 = 1052456, wasm2js_i32$1 = HEAP32[263114] & __wasm_rotl_i32($3_1 >>> 3 | 0)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
    }
    label$7 : {
     $3_1 = HEAP32[$2_1 + 4 >> 2];
     if ($3_1 & 2) {
      HEAP32[$2_1 + 4 >> 2] = $3_1 & -2;
      HEAP32[$1_1 + 4 >> 2] = $0_1 | 1;
      HEAP32[$0_1 + $1_1 >> 2] = $0_1;
      break label$7;
     }
     label$9 : {
      label$10 : {
       label$11 : {
        if (($2_1 | 0) != HEAP32[263119]) {
         if (($2_1 | 0) != HEAP32[263118]) {
          break label$11
         }
         HEAP32[263118] = $1_1;
         $0_1 = HEAP32[263116] + $0_1 | 0;
         HEAP32[263116] = $0_1;
         HEAP32[$1_1 + 4 >> 2] = $0_1 | 1;
         HEAP32[$0_1 + $1_1 >> 2] = $0_1;
         return;
        }
        HEAP32[263119] = $1_1;
        $0_1 = HEAP32[263117] + $0_1 | 0;
        HEAP32[263117] = $0_1;
        HEAP32[$1_1 + 4 >> 2] = $0_1 | 1;
        if (HEAP32[263118] == ($1_1 | 0)) {
         break label$10
        }
        break label$9;
       }
       $4_1 = $3_1 & -8;
       $0_1 = $4_1 + $0_1 | 0;
       label$13 : {
        if ($4_1 >>> 0 >= 256) {
         $7($2_1);
         break label$13;
        }
        $4_1 = HEAP32[$2_1 + 12 >> 2];
        $2_1 = HEAP32[$2_1 + 8 >> 2];
        if (($4_1 | 0) != ($2_1 | 0)) {
         HEAP32[$2_1 + 12 >> 2] = $4_1;
         HEAP32[$4_1 + 8 >> 2] = $2_1;
         break label$13;
        }
        (wasm2js_i32$0 = 1052456, wasm2js_i32$1 = HEAP32[263114] & __wasm_rotl_i32($3_1 >>> 3 | 0)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
       }
       HEAP32[$1_1 + 4 >> 2] = $0_1 | 1;
       HEAP32[$0_1 + $1_1 >> 2] = $0_1;
       if (HEAP32[263118] != ($1_1 | 0)) {
        break label$7
       }
       HEAP32[263116] = $0_1;
       break label$2;
      }
      HEAP32[263116] = 0;
      HEAP32[263118] = 0;
     }
     if ($0_1 >>> 0 <= HEAPU32[263122]) {
      break label$2
     }
     $0_1 = HEAP32[263119];
     if (!$0_1) {
      break label$2
     }
     label$16 : {
      if (HEAPU32[263117] < 41) {
       break label$16
      }
      $1_1 = 1052176;
      while (1) {
       $2_1 = HEAP32[$1_1 >> 2];
       if ($2_1 >>> 0 <= $0_1 >>> 0 & $0_1 >>> 0 < $2_1 + HEAP32[$1_1 + 4 >> 2] >>> 0) {
        break label$16
       }
       $1_1 = HEAP32[$1_1 + 8 >> 2];
       if ($1_1) {
        continue
       }
       break;
      };
     }
     $25();
     if (HEAPU32[263117] <= HEAPU32[263122]) {
      break label$2
     }
     HEAP32[263122] = -1;
     return;
    }
    if ($0_1 >>> 0 < 256) {
     break label$1
    }
    $8($1_1, $0_1);
    $0_1 = HEAP32[263124] - 1 | 0;
    HEAP32[263124] = $0_1;
    if ($0_1) {
     break label$2
    }
    $25();
    return;
   }
   return;
  }
  $2_1 = ($0_1 & -8) + 1052192 | 0;
  $3_1 = HEAP32[263114];
  $0_1 = 1 << ($0_1 >>> 3);
  if ($3_1 & $0_1) {
   $0_1 = HEAP32[$2_1 + 8 >> 2]
  } else {
   HEAP32[263114] = $0_1 | $3_1;
   $0_1 = $2_1;
  }
  HEAP32[$2_1 + 8 >> 2] = $1_1;
  HEAP32[$0_1 + 12 >> 2] = $1_1;
  HEAP32[$1_1 + 12 >> 2] = $2_1;
  HEAP32[$1_1 + 8 >> 2] = $0_1;
 }

 function $6($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $2_1 = $0_1 + $1_1 | 0;
  label$1 : {
   $3_1 = HEAP32[$0_1 + 4 >> 2];
   label$2 : {
    label$3 : {
     if ($3_1 & 1) {
      break label$3
     }
     if (!($3_1 & 3)) {
      break label$2
     }
     $3_1 = HEAP32[$0_1 >> 2];
     $1_1 = $3_1 + $1_1 | 0;
     $0_1 = $0_1 - $3_1 | 0;
     if (($0_1 | 0) == HEAP32[263118]) {
      if ((HEAP32[$2_1 + 4 >> 2] & 3) != 3) {
       break label$3
      }
      HEAP32[263116] = $1_1;
      HEAP32[$2_1 + 4 >> 2] = HEAP32[$2_1 + 4 >> 2] & -2;
      HEAP32[$0_1 + 4 >> 2] = $1_1 | 1;
      HEAP32[$2_1 >> 2] = $1_1;
      return;
     }
     if ($3_1 >>> 0 >= 256) {
      $7($0_1);
      break label$3;
     }
     $4_1 = HEAP32[$0_1 + 8 >> 2];
     $5_1 = HEAP32[$0_1 + 12 >> 2];
     if (($4_1 | 0) != ($5_1 | 0)) {
      HEAP32[$4_1 + 12 >> 2] = $5_1;
      HEAP32[$5_1 + 8 >> 2] = $4_1;
      break label$3;
     }
     (wasm2js_i32$0 = 1052456, wasm2js_i32$1 = HEAP32[263114] & __wasm_rotl_i32($3_1 >>> 3 | 0)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
    }
    $3_1 = HEAP32[$2_1 + 4 >> 2];
    if ($3_1 & 2) {
     HEAP32[$2_1 + 4 >> 2] = $3_1 & -2;
     HEAP32[$0_1 + 4 >> 2] = $1_1 | 1;
     HEAP32[$0_1 + $1_1 >> 2] = $1_1;
     break label$1;
    }
    label$8 : {
     if (($2_1 | 0) != HEAP32[263119]) {
      if (($2_1 | 0) != HEAP32[263118]) {
       break label$8
      }
      HEAP32[263118] = $0_1;
      $1_1 = HEAP32[263116] + $1_1 | 0;
      HEAP32[263116] = $1_1;
      HEAP32[$0_1 + 4 >> 2] = $1_1 | 1;
      HEAP32[$0_1 + $1_1 >> 2] = $1_1;
      return;
     }
     HEAP32[263119] = $0_1;
     $1_1 = HEAP32[263117] + $1_1 | 0;
     HEAP32[263117] = $1_1;
     HEAP32[$0_1 + 4 >> 2] = $1_1 | 1;
     if (HEAP32[263118] != ($0_1 | 0)) {
      break label$2
     }
     HEAP32[263116] = 0;
     HEAP32[263118] = 0;
     return;
    }
    $4_1 = $3_1 & -8;
    $1_1 = $4_1 + $1_1 | 0;
    label$10 : {
     if ($4_1 >>> 0 >= 256) {
      $7($2_1);
      break label$10;
     }
     $4_1 = HEAP32[$2_1 + 12 >> 2];
     $2_1 = HEAP32[$2_1 + 8 >> 2];
     if (($4_1 | 0) != ($2_1 | 0)) {
      HEAP32[$2_1 + 12 >> 2] = $4_1;
      HEAP32[$4_1 + 8 >> 2] = $2_1;
      break label$10;
     }
     (wasm2js_i32$0 = 1052456, wasm2js_i32$1 = HEAP32[263114] & __wasm_rotl_i32($3_1 >>> 3 | 0)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
    }
    HEAP32[$0_1 + 4 >> 2] = $1_1 | 1;
    HEAP32[$0_1 + $1_1 >> 2] = $1_1;
    if (HEAP32[263118] != ($0_1 | 0)) {
     break label$1
    }
    HEAP32[263116] = $1_1;
   }
   return;
  }
  if ($1_1 >>> 0 >= 256) {
   $8($0_1, $1_1);
   return;
  }
  $2_1 = ($1_1 & -8) + 1052192 | 0;
  $3_1 = HEAP32[263114];
  $1_1 = 1 << ($1_1 >>> 3);
  if ($3_1 & $1_1) {
   $1_1 = HEAP32[$2_1 + 8 >> 2]
  } else {
   HEAP32[263114] = $1_1 | $3_1;
   $1_1 = $2_1;
  }
  HEAP32[$2_1 + 8 >> 2] = $0_1;
  HEAP32[$1_1 + 12 >> 2] = $0_1;
  HEAP32[$0_1 + 12 >> 2] = $2_1;
  HEAP32[$0_1 + 8 >> 2] = $1_1;
 }

 function $7($0_1) {
  var $1_1 = 0, $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $4_1 = HEAP32[$0_1 + 24 >> 2];
  label$1 : {
   label$2 : {
    $1_1 = HEAP32[$0_1 + 12 >> 2];
    if (($1_1 | 0) == ($0_1 | 0)) {
     $1_1 = $0_1 + 20 | 0;
     $3_1 = HEAP32[$1_1 >> 2];
     $2_1 = HEAP32[($3_1 ? 20 : 16) + $0_1 >> 2];
     if ($2_1) {
      break label$2
     }
     $1_1 = 0;
     break label$1;
    }
    $2_1 = HEAP32[$0_1 + 8 >> 2];
    HEAP32[$2_1 + 12 >> 2] = $1_1;
    HEAP32[$1_1 + 8 >> 2] = $2_1;
    break label$1;
   }
   $3_1 = $3_1 ? $1_1 : $0_1 + 16 | 0;
   while (1) {
    $5_1 = $3_1;
    $1_1 = $2_1;
    $3_1 = $1_1 + 20 | 0;
    $2_1 = HEAP32[$3_1 >> 2];
    $3_1 = $2_1 ? $3_1 : $1_1 + 16 | 0;
    $2_1 = HEAP32[($2_1 ? 20 : 16) + $1_1 >> 2];
    if ($2_1) {
     continue
    }
    break;
   };
   HEAP32[$5_1 >> 2] = 0;
  }
  label$5 : {
   if (!$4_1) {
    break label$5
   }
   label$6 : {
    $2_1 = (HEAP32[$0_1 + 28 >> 2] << 2) + 1052048 | 0;
    if (HEAP32[$2_1 >> 2] != ($0_1 | 0)) {
     HEAP32[(HEAP32[$4_1 + 16 >> 2] == ($0_1 | 0) ? 16 : 20) + $4_1 >> 2] = $1_1;
     if (!$1_1) {
      break label$5
     }
     break label$6;
    }
    HEAP32[$2_1 >> 2] = $1_1;
    if ($1_1) {
     break label$6
    }
    (wasm2js_i32$0 = 1052460, wasm2js_i32$1 = HEAP32[263115] & __wasm_rotl_i32(HEAP32[$0_1 + 28 >> 2])), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
    return;
   }
   HEAP32[$1_1 + 24 >> 2] = $4_1;
   $2_1 = HEAP32[$0_1 + 16 >> 2];
   if ($2_1) {
    HEAP32[$1_1 + 16 >> 2] = $2_1;
    HEAP32[$2_1 + 24 >> 2] = $1_1;
   }
   $0_1 = HEAP32[$0_1 + 20 >> 2];
   if (!$0_1) {
    break label$5
   }
   HEAP32[$1_1 + 20 >> 2] = $0_1;
   HEAP32[$0_1 + 24 >> 2] = $1_1;
  }
 }

 function $8($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0;
  $2_1 = 31;
  HEAP32[$0_1 + 16 >> 2] = 0;
  HEAP32[$0_1 + 20 >> 2] = 0;
  if ($1_1 >>> 0 <= 16777215) {
   $3_1 = Math_clz32($1_1 >>> 8 | 0);
   $2_1 = (($1_1 >>> 6 - $3_1 & 1) - ($3_1 << 1) | 0) + 62 | 0;
  }
  HEAP32[$0_1 + 28 >> 2] = $2_1;
  $4_1 = ($2_1 << 2) + 1052048 | 0;
  label$2 : {
   label$3 : {
    label$4 : {
     label$5 : {
      $5_1 = HEAP32[263115];
      $3_1 = 1 << $2_1;
      if ($5_1 & $3_1) {
       $3_1 = HEAP32[$4_1 >> 2];
       if ((HEAP32[$3_1 + 4 >> 2] & -8) != ($1_1 | 0)) {
        break label$5
       }
       $2_1 = $3_1;
       break label$4;
      }
      HEAP32[263115] = $3_1 | $5_1;
      HEAP32[$4_1 >> 2] = $0_1;
      HEAP32[$0_1 + 24 >> 2] = $4_1;
      break label$2;
     }
     $4_1 = $1_1 << (($2_1 | 0) != 31 ? 25 - ($2_1 >>> 1 | 0) & 31 : 0);
     while (1) {
      $5_1 = (($4_1 >>> 29 & 4) + $3_1 | 0) + 16 | 0;
      $2_1 = HEAP32[$5_1 >> 2];
      if (!$2_1) {
       break label$3
      }
      $4_1 = $4_1 << 1;
      $3_1 = $2_1;
      if ((HEAP32[$2_1 + 4 >> 2] & -8) != ($1_1 | 0)) {
       continue
      }
      break;
     };
    }
    $1_1 = HEAP32[$2_1 + 8 >> 2];
    HEAP32[$1_1 + 12 >> 2] = $0_1;
    HEAP32[$2_1 + 8 >> 2] = $0_1;
    HEAP32[$0_1 + 24 >> 2] = 0;
    HEAP32[$0_1 + 12 >> 2] = $2_1;
    HEAP32[$0_1 + 8 >> 2] = $1_1;
    return;
   }
   HEAP32[$5_1 >> 2] = $0_1;
   HEAP32[$0_1 + 24 >> 2] = $3_1;
  }
  HEAP32[$0_1 + 12 >> 2] = $0_1;
  HEAP32[$0_1 + 8 >> 2] = $0_1;
 }

 function $9($0_1, $1_1, $2_1) {
  var $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0, $11_1 = 0, $12_1 = 0;
  $4_1 = global$0 - 96 | 0;
  global$0 = $4_1;
  $35($4_1 + 8 | 0, 88);
  HEAP32[$4_1 >> 2] = $2_1;
  HEAP32[$4_1 + 4 >> 2] = 0;
  $2_1 = $2_1 << 3;
  label$1 : {
   label$2 : {
    while (1) {
     label$4 : {
      if (!$2_1) {
       if ($7_1) {
        break label$4
       }
       break label$1;
      }
      $3_1 = $7_1 + 4 | 0;
      if ($3_1 >>> 0 > 11) {
       break label$2
      }
      $3_1 = ($3_1 << 3) + $4_1 | 0;
      $10_1 = $3_1;
      $11_1 = HEAP32[$3_1 >> 2];
      $9_1 = HEAP32[$3_1 + 4 >> 2];
      $3_1 = HEAP32[$1_1 + 4 >> 2];
      $12_1 = $3_1;
      $5_1 = HEAP32[$1_1 >> 2];
      $8_1 = $5_1 - 1 | 0;
      $3_1 = ($8_1 | 0) != -1 ? $3_1 + 1 | 0 : $3_1;
      $6_1 = $8_1;
      $8_1 = ($12_1 | 0) == -1 & ($5_1 | 0) != 0;
      $5_1 = $8_1 ? $6_1 : $5_1;
      $6_1 = $5_1 + $11_1 | 0;
      $3_1 = ($8_1 ? $3_1 : $12_1) + $9_1 | 0;
      $3_1 = $5_1 >>> 0 > $6_1 >>> 0 ? $3_1 + 1 | 0 : $3_1;
      $5_1 = ($9_1 | 0) == ($3_1 | 0) & $6_1 >>> 0 < $11_1 >>> 0 | $3_1 >>> 0 < $9_1 >>> 0 ? -1 : 0;
      $5_1 = $5_1 + $6_1 | 0;
      $3_1 = $5_1 >>> 0 < $6_1 >>> 0 ? $3_1 + 1 | 0 : $3_1;
      HEAP32[$10_1 >> 2] = $5_1;
      HEAP32[$10_1 + 4 >> 2] = $3_1;
      $7_1 = $7_1 + 1 | 0;
      if (!($7_1 & 7)) {
       $1($4_1);
       $7_1 = 0;
      }
      $1_1 = $1_1 + 8 | 0;
      $2_1 = $2_1 - 8 | 0;
      continue;
     }
     break;
    };
    $1($4_1);
    break label$1;
   }
   $0_1 = global$0 - 48 | 0;
   global$0 = $0_1;
   HEAP32[$0_1 >> 2] = $3_1;
   HEAP32[$0_1 + 4 >> 2] = 12;
   HEAP32[$0_1 + 20 >> 2] = 2;
   HEAP32[$0_1 + 28 >> 2] = 2;
   HEAP32[$0_1 + 44 >> 2] = 1;
   HEAP32[$0_1 + 16 >> 2] = 1048700;
   HEAP32[$0_1 + 8 >> 2] = 0;
   HEAP32[$0_1 + 36 >> 2] = 1;
   HEAP32[$0_1 + 24 >> 2] = $0_1 + 32;
   HEAP32[$0_1 + 40 >> 2] = $0_1;
   HEAP32[$0_1 + 32 >> 2] = $0_1 + 4;
   $26($0_1 + 8 | 0, 1049124);
   wasm2js_trap();
  }
  $1_1 = HEAP32[$4_1 + 36 >> 2];
  HEAP32[$0_1 >> 2] = HEAP32[$4_1 + 32 >> 2];
  HEAP32[$0_1 + 4 >> 2] = $1_1;
  $2_1 = $4_1 + 56 | 0;
  $1_1 = HEAP32[$2_1 + 4 >> 2];
  $3_1 = $0_1 + 24 | 0;
  HEAP32[$3_1 >> 2] = HEAP32[$2_1 >> 2];
  HEAP32[$3_1 + 4 >> 2] = $1_1;
  $2_1 = $4_1 + 48 | 0;
  $1_1 = HEAP32[$2_1 + 4 >> 2];
  $3_1 = $0_1 + 16 | 0;
  HEAP32[$3_1 >> 2] = HEAP32[$2_1 >> 2];
  HEAP32[$3_1 + 4 >> 2] = $1_1;
  $2_1 = $0_1 + 8 | 0;
  $1_1 = $4_1 + 40 | 0;
  $0_1 = HEAP32[$1_1 + 4 >> 2];
  HEAP32[$2_1 >> 2] = HEAP32[$1_1 >> 2];
  HEAP32[$2_1 + 4 >> 2] = $0_1;
  global$0 = $4_1 + 96 | 0;
 }

 function $10($0_1, $1_1, $2_1, $3_1) {
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  global$0 = $4_1;
  $5_1 = $0_1;
  label$1 : {
   label$2 : {
    if ($2_1) {
     label$4 : {
      label$5 : {
       if (($1_1 | 0) >= 0) {
        if (HEAP32[$3_1 + 8 >> 2]) {
         break label$5
        }
        $30($4_1, $1_1, $2_1);
        $3_1 = HEAP32[$4_1 >> 2];
        $0_1 = HEAP32[$4_1 + 4 >> 2];
        break label$4;
       }
       HEAP32[$5_1 + 8 >> 2] = 0;
       break label$2;
      }
      if (!HEAP32[$3_1 + 4 >> 2]) {
       $30($4_1 + 8 | 0, $1_1, $2_1);
       $3_1 = HEAP32[$4_1 + 8 >> 2];
       $0_1 = HEAP32[$4_1 + 12 >> 2];
       break label$4;
      }
      $3_1 = $4(HEAP32[$3_1 >> 2], $1_1);
      $0_1 = $1_1;
     }
     if ($3_1) {
      HEAP32[$5_1 + 4 >> 2] = $3_1;
      HEAP32[$5_1 + 8 >> 2] = $0_1;
      $0_1 = 0;
      break label$1;
     }
     HEAP32[$5_1 + 4 >> 2] = $1_1;
     HEAP32[$5_1 + 8 >> 2] = $2_1;
     break label$2;
    }
    HEAP32[$5_1 + 4 >> 2] = $1_1;
    HEAP32[$5_1 + 8 >> 2] = 0;
   }
   $0_1 = 1;
  }
  HEAP32[$5_1 >> 2] = $0_1;
  global$0 = $4_1 + 16 | 0;
 }

 function $11($0_1, $1_1, $2_1, $3_1) {
  var $4_1 = 0, $5_1 = 0, $6_1 = 0;
  $4_1 = global$0 - 32 | 0;
  global$0 = $4_1;
  $3_1 = $2_1 + $3_1 | 0;
  $5_1 = 0;
  label$1 : {
   if ($3_1 >>> 0 < $2_1 >>> 0) {
    break label$1
   }
   $2_1 = HEAP32[$1_1 >> 2];
   $6_1 = $2_1 << 1;
   $3_1 = $3_1 >>> 0 < $6_1 >>> 0 ? $6_1 : $3_1;
   $6_1 = $3_1 >>> 0 <= 4 ? 4 : $3_1;
   $3_1 = $6_1 << 3;
   $5_1 = ($6_1 >>> 0 < 268435456) << 3;
   label$2 : {
    if ($2_1) {
     HEAP32[$4_1 + 24 >> 2] = 8;
     HEAP32[$4_1 + 20 >> 2] = $2_1 << 3;
     HEAP32[$4_1 + 16 >> 2] = HEAP32[$1_1 + 4 >> 2];
     break label$2;
    }
    HEAP32[$4_1 + 24 >> 2] = 0;
   }
   $10($4_1, $3_1, $5_1, $4_1 + 16 | 0);
   $3_1 = HEAP32[$4_1 + 4 >> 2];
   $5_1 = HEAP32[$4_1 + 8 >> 2];
   if (HEAP32[$4_1 >> 2]) {
    break label$1
   }
   HEAP32[$1_1 >> 2] = $6_1;
   HEAP32[$1_1 + 4 >> 2] = $3_1;
   $5_1 = -2147483647;
  }
  HEAP32[$0_1 + 4 >> 2] = $5_1;
  HEAP32[$0_1 >> 2] = $3_1;
  global$0 = $4_1 + 32 | 0;
 }

 function $12($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0, $11_1 = 0, $12_1 = 0, $13_1 = 0;
  $6_1 = global$0 - 32 | 0;
  global$0 = $6_1;
  $3_1 = HEAP32[$1_1 >> 2];
  $2_1 = HEAP32[$1_1 + 4 >> 2];
  $4_1 = $3_1 - $2_1 >>> 3 | 0;
  $15($6_1, $4_1);
  $5_1 = HEAP32[$6_1 + 4 >> 2];
  $9_1 = HEAP32[$6_1 >> 2];
  HEAP32[$0_1 + 8 >> 2] = 0;
  HEAP32[$0_1 >> 2] = $9_1;
  HEAP32[$0_1 + 4 >> 2] = $5_1;
  $21($0_1, $4_1);
  $5_1 = HEAP32[$0_1 + 4 >> 2];
  $4_1 = HEAP32[$0_1 + 8 >> 2];
  HEAP32[$6_1 + 24 >> 2] = HEAP32[$1_1 + 16 >> 2];
  HEAP32[$6_1 + 8 >> 2] = $3_1;
  $9_1 = HEAP32[$1_1 + 12 >> 2];
  HEAP32[$6_1 + 16 >> 2] = HEAP32[$1_1 + 8 >> 2];
  HEAP32[$6_1 + 20 >> 2] = $9_1;
  $1_1 = ($4_1 << 3) + $5_1 | 0;
  while (1) {
   if (($2_1 | 0) != ($3_1 | 0)) {
    $5_1 = HEAP32[$2_1 + 4 >> 2];
    HEAP32[$1_1 >> 2] = HEAP32[$2_1 >> 2];
    HEAP32[$1_1 + 4 >> 2] = $5_1;
    $1_1 = $1_1 + 8 | 0;
    $4_1 = $4_1 + 1 | 0;
    $2_1 = $2_1 + 8 | 0;
    continue;
   }
   break;
  };
  HEAP32[$0_1 + 8 >> 2] = $4_1;
  HEAP32[$6_1 + 12 >> 2] = 1049456;
  HEAP32[$6_1 + 8 >> 2] = 1049456;
  $9_1 = $6_1 + 8 | 0;
  $1_1 = HEAP32[$9_1 + 12 >> 2];
  if ($1_1) {
   $11_1 = HEAP32[$9_1 + 16 >> 2];
   $12_1 = HEAP32[$11_1 + 8 >> 2];
   $0_1 = HEAP32[$9_1 + 8 >> 2];
   if (($12_1 | 0) != ($0_1 | 0)) {
    label$5 : {
     label$6 : {
      label$7 : {
       label$8 : {
        $5_1 = $1_1 << 3;
        $1_1 = HEAP32[$11_1 + 4 >> 2];
        $2_1 = $1_1 + ($12_1 << 3) | 0;
        $0_1 = $1_1 + ($0_1 << 3) | 0;
        if ($5_1 >>> 0 > $2_1 - $0_1 >>> 0) {
         $4_1 = $0_1 + $5_1 | 0;
         $1_1 = $2_1 + $5_1 | 0;
         if ($5_1 >>> 0 > 15) {
          break label$8
         }
         break label$7;
        }
        if ($5_1 >>> 0 <= 15) {
         $1_1 = $2_1;
         break label$6;
        }
        $4_1 = 0 - $2_1 & 3;
        $3_1 = $4_1 + $2_1 | 0;
        if ($4_1) {
         $1_1 = $2_1;
         $2_1 = $0_1;
         while (1) {
          HEAP8[$1_1 | 0] = HEAPU8[$2_1 | 0];
          $2_1 = $2_1 + 1 | 0;
          $1_1 = $1_1 + 1 | 0;
          if ($3_1 >>> 0 > $1_1 >>> 0) {
           continue
          }
          break;
         };
        }
        $5_1 = $5_1 - $4_1 | 0;
        $7_1 = $5_1 & -4;
        $1_1 = $7_1 + $3_1 | 0;
        $4_1 = $0_1 + $4_1 | 0;
        $2_1 = $4_1 & 3;
        label$13 : {
         if ($2_1) {
          if (($7_1 | 0) <= 0) {
           break label$13
          }
          $8_1 = $4_1 & -4;
          $0_1 = $8_1 + 4 | 0;
          $10_1 = $2_1 << 3;
          $13_1 = 0 - $10_1 & 24;
          $2_1 = HEAP32[$8_1 >> 2];
          while (1) {
           $8_1 = $2_1 >>> $10_1 | 0;
           $2_1 = HEAP32[$0_1 >> 2];
           HEAP32[$3_1 >> 2] = $8_1 | $2_1 << $13_1;
           $0_1 = $0_1 + 4 | 0;
           $3_1 = $3_1 + 4 | 0;
           if ($3_1 >>> 0 < $1_1 >>> 0) {
            continue
           }
           break;
          };
          break label$13;
         }
         if (($7_1 | 0) <= 0) {
          break label$13
         }
         $0_1 = $4_1;
         while (1) {
          HEAP32[$3_1 >> 2] = HEAP32[$0_1 >> 2];
          $0_1 = $0_1 + 4 | 0;
          $3_1 = $3_1 + 4 | 0;
          if ($3_1 >>> 0 < $1_1 >>> 0) {
           continue
          }
          break;
         };
        }
        $5_1 = $5_1 & 3;
        $0_1 = $4_1 + $7_1 | 0;
        break label$6;
       }
       $2_1 = $1_1 & -4;
       $7_1 = $1_1 & 3;
       $8_1 = 0 - $7_1 | 0;
       if ($7_1) {
        $3_1 = ($0_1 + $5_1 | 0) - 1 | 0;
        while (1) {
         $1_1 = $1_1 - 1 | 0;
         HEAP8[$1_1 | 0] = HEAPU8[$3_1 | 0];
         $3_1 = $3_1 - 1 | 0;
         if ($1_1 >>> 0 > $2_1 >>> 0) {
          continue
         }
         break;
        };
       }
       $7_1 = $5_1 - $7_1 | 0;
       $3_1 = $7_1 & -4;
       $1_1 = $2_1 - $3_1 | 0;
       $5_1 = 0 - $3_1 | 0;
       $4_1 = $4_1 + $8_1 | 0;
       $3_1 = $4_1 & 3;
       label$19 : {
        if ($3_1) {
         if (($5_1 | 0) >= 0) {
          break label$19
         }
         $8_1 = $4_1 & -4;
         $0_1 = $8_1 - 4 | 0;
         $10_1 = $3_1 << 3;
         $13_1 = 0 - $10_1 & 24;
         $3_1 = HEAP32[$8_1 >> 2];
         while (1) {
          $2_1 = $2_1 - 4 | 0;
          $8_1 = $3_1 << $13_1;
          $3_1 = HEAP32[$0_1 >> 2];
          HEAP32[$2_1 >> 2] = $8_1 | $3_1 >>> $10_1;
          $0_1 = $0_1 - 4 | 0;
          if ($1_1 >>> 0 < $2_1 >>> 0) {
           continue
          }
          break;
         };
         break label$19;
        }
        if (($5_1 | 0) >= 0) {
         break label$19
        }
        $0_1 = ($0_1 + $7_1 | 0) - 4 | 0;
        while (1) {
         $2_1 = $2_1 - 4 | 0;
         HEAP32[$2_1 >> 2] = HEAP32[$0_1 >> 2];
         $0_1 = $0_1 - 4 | 0;
         if ($1_1 >>> 0 < $2_1 >>> 0) {
          continue
         }
         break;
        };
       }
       $0_1 = $7_1 & 3;
       if (!$0_1) {
        break label$5
       }
       $4_1 = $5_1 + $4_1 | 0;
       $2_1 = $1_1 - $0_1 | 0;
      }
      $0_1 = $4_1 - 1 | 0;
      while (1) {
       $1_1 = $1_1 - 1 | 0;
       HEAP8[$1_1 | 0] = HEAPU8[$0_1 | 0];
       $0_1 = $0_1 - 1 | 0;
       if ($1_1 >>> 0 > $2_1 >>> 0) {
        continue
       }
       break;
      };
      break label$5;
     }
     if (!$5_1) {
      break label$5
     }
     $2_1 = $1_1 + $5_1 | 0;
     while (1) {
      HEAP8[$1_1 | 0] = HEAPU8[$0_1 | 0];
      $0_1 = $0_1 + 1 | 0;
      $1_1 = $1_1 + 1 | 0;
      if ($2_1 >>> 0 > $1_1 >>> 0) {
       continue
      }
      break;
     };
    }
    $1_1 = HEAP32[$9_1 + 12 >> 2];
   }
   HEAP32[$11_1 + 8 >> 2] = $1_1 + $12_1;
  }
  global$0 = $6_1 + 32 | 0;
 }

 function $13($0_1, $1_1, $2_1, $3_1) {
  var $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  global$0 = $4_1;
  $6_1 = $2_1;
  $7_1 = __wasm_i64_mul($0_1, 0, $2_1, 0);
  $5_1 = i64toi32_i32$HIGH_BITS;
  $9_1 = $5_1;
  $11_1 = $3_1;
  $8_1 = __wasm_i64_mul($0_1, 0, $3_1, 0);
  $2_1 = i64toi32_i32$HIGH_BITS;
  $10_1 = $2_1;
  $0_1 = $6_1;
  $6_1 = $1_1;
  $3_1 = 0;
  $1_1 = __wasm_i64_mul($0_1, 0, $1_1, $3_1);
  $0_1 = $1_1 + $8_1 | 0;
  $2_1 = i64toi32_i32$HIGH_BITS + $2_1 | 0;
  $1_1 = $0_1 >>> 0 < $1_1 >>> 0 ? $2_1 + 1 | 0 : $2_1;
  $3_1 = $0_1 + $5_1 | 0;
  $2_1 = 0;
  $2_1 = $2_1 + $7_1 | 0;
  HEAP32[$4_1 >> 2] = $2_1;
  HEAP32[$4_1 + 4 >> 2] = $3_1;
  $5_1 = $4_1;
  $7_1 = ($3_1 | 0) == ($9_1 | 0) & $7_1 >>> 0 > $2_1 >>> 0 | $3_1 >>> 0 < $9_1 >>> 0;
  $0_1 = ($1_1 | 0) == ($10_1 | 0) & $0_1 >>> 0 < $8_1 >>> 0 | $1_1 >>> 0 < $10_1 >>> 0;
  $4_1 = __wasm_i64_mul($11_1, 0, $6_1, 0) + $1_1 | 0;
  $0_1 = $0_1 + i64toi32_i32$HIGH_BITS | 0;
  $0_1 = $1_1 >>> 0 > $4_1 >>> 0 ? $0_1 + 1 | 0 : $0_1;
  $1_1 = $4_1 + $7_1 | 0;
  $0_1 = $1_1 >>> 0 < $4_1 >>> 0 ? $0_1 + 1 | 0 : $0_1;
  HEAP32[$5_1 + 8 >> 2] = $1_1;
  HEAP32[$5_1 + 12 >> 2] = $0_1;
  global$0 = $5_1 + 16 | 0;
  $1_1 = $5_1 + 8 | 0;
  $0_1 = HEAP32[$1_1 >> 2];
  $2_1 = HEAP32[$5_1 >> 2];
  $7_1 = $2_1;
  $6_1 = HEAP32[$1_1 + 4 >> 2];
  $4_1 = HEAP32[$5_1 + 4 >> 2];
  $1_1 = 0;
  $2_1 = ($4_1 | 0) == ($1_1 | 0) & $2_1 >>> 0 < $6_1 >>> 0;
  $5_1 = $2_1;
  $8_1 = ($7_1 - $6_1 | 0) + $2_1 | 0;
  $2_1 = ($4_1 - ($6_1 >>> 0 > $7_1 >>> 0) | 0) + ($2_1 ? -1 : 0) | 0;
  $4_1 = 0 - $0_1 | 0;
  $2_1 = $5_1 >>> 0 > $8_1 >>> 0 ? $2_1 + 1 | 0 : $2_1;
  $0_1 = $2_1 + ($0_1 - (($0_1 | 0) != 0) | 0) | 0;
  $1_1 = $8_1;
  $3_1 = $1_1 + $4_1 | 0;
  $0_1 = $3_1 >>> 0 < $4_1 >>> 0 ? $0_1 + 1 | 0 : $0_1;
  $1_1 = ($2_1 | 0) == ($0_1 | 0) & $1_1 >>> 0 > $3_1 >>> 0 | $0_1 >>> 0 < $2_1 >>> 0 ? -1 : 0;
  $2_1 = $0_1;
  $0_1 = $1_1 + $3_1 | 0;
  i64toi32_i32$HIGH_BITS = $0_1 >>> 0 < $3_1 >>> 0 ? $2_1 + 1 | 0 : $2_1;
  return $0_1;
 }

 function $14($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0;
  $2_1 = global$0 - 16 | 0;
  global$0 = $2_1;
  $3_1 = HEAP32[$1_1 + 108 >> 2];
  if (($3_1 | 0) == HEAP32[$1_1 + 104 >> 2]) {
   $1_1 = 0
  } else {
   HEAP32[$1_1 + 108 >> 2] = $3_1 + 8;
   $18($2_1, $1_1);
   $4_1 = HEAP32[$2_1 + 8 >> 2];
   $5_1 = HEAP32[$2_1 + 12 >> 2];
   $1_1 = HEAP32[$2_1 >> 2] ? $3_1 : 0;
  }
  HEAP32[$0_1 + 8 >> 2] = $4_1;
  HEAP32[$0_1 + 12 >> 2] = $5_1;
  HEAP32[$0_1 >> 2] = $1_1;
  global$0 = $2_1 + 16 | 0;
 }

 function $15($0_1, $1_1) {
  var $2_1 = 0;
  label$1 : {
   if (!$1_1) {
    $2_1 = 8;
    break label$1;
   }
   label$3 : {
    if ($1_1 >>> 0 > 268435455) {
     break label$3
    }
    $2_1 = $1_1 << 3;
    if (($2_1 | 0) < 0) {
     break label$3
    }
    if ($2_1) {
     $2_1 = $0($2_1)
    } else {
     $2_1 = ($1_1 >>> 0 < 268435456) << 3
    }
    if ($2_1) {
     break label$1
    }
    wasm2js_trap();
   }
   $22();
   wasm2js_trap();
  }
  HEAP32[$0_1 + 4 >> 2] = $2_1;
  HEAP32[$0_1 >> 2] = $1_1;
 }

 function $16($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0;
  $3_1 = HEAP32[$1_1 + 8 >> 2];
  if ($3_1 >>> 0 < HEAPU32[$1_1 >> 2]) {
   $2_1 = HEAP32[$1_1 + 4 >> 2];
   label$2 : {
    if ($3_1) {
     $2_1 = $4($2_1, $3_1 << 3);
     if ($2_1) {
      break label$2
     }
     wasm2js_trap();
    }
    $5($2_1);
    $2_1 = 8;
   }
   HEAP32[$1_1 >> 2] = $3_1;
   HEAP32[$1_1 + 4 >> 2] = $2_1;
  }
  HEAP32[$0_1 + 4 >> 2] = $3_1;
  HEAP32[$0_1 >> 2] = HEAP32[$1_1 + 4 >> 2];
 }

 function $17($0_1, $1_1) {
  var $2_1 = 0;
  $2_1 = global$0 - 16 | 0;
  global$0 = $2_1;
  $27($2_1 + 8 | 0, $1_1 + 1152 | 0);
  if (HEAP32[$2_1 + 8 >> 2]) {
   $36($0_1 + 8 | 0, Math_imul(HEAP32[$2_1 + 12 >> 2], 96) + $1_1 | 0, 96);
   $1_1 = 1;
  } else {
   $1_1 = 0
  }
  HEAP32[$0_1 >> 2] = $1_1;
  HEAP32[$0_1 + 4 >> 2] = 0;
  global$0 = $2_1 + 16 | 0;
 }

 function $18($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0, $4_1 = 0;
  $2_1 = global$0 - 16 | 0;
  global$0 = $2_1;
  $27($2_1 + 8 | 0, $1_1 + 96 | 0);
  if (HEAP32[$2_1 + 8 >> 2]) {
   $1_1 = (HEAP32[$2_1 + 12 >> 2] << 3) + $1_1 | 0;
   $3_1 = HEAP32[$1_1 >> 2];
   $4_1 = HEAP32[$1_1 + 4 >> 2];
   $1_1 = 1;
  } else {
   $1_1 = 0
  }
  HEAP32[$0_1 + 8 >> 2] = $3_1;
  HEAP32[$0_1 + 12 >> 2] = $4_1;
  HEAP32[$0_1 >> 2] = $1_1;
  HEAP32[$0_1 + 4 >> 2] = 0;
  global$0 = $2_1 + 16 | 0;
 }

 function $19($0_1, $1_1, $2_1) {
  var $3_1 = 0;
  $3_1 = HEAP32[$1_1 + 8 >> 2];
  if ($3_1 >>> 0 < $2_1 >>> 0) {
   $0_1 = global$0 - 48 | 0;
   global$0 = $0_1;
   HEAP32[$0_1 + 4 >> 2] = $3_1;
   HEAP32[$0_1 >> 2] = $2_1;
   HEAP32[$0_1 + 20 >> 2] = 2;
   HEAP32[$0_1 + 28 >> 2] = 2;
   HEAP32[$0_1 + 44 >> 2] = 1;
   HEAP32[$0_1 + 16 >> 2] = 1048968;
   HEAP32[$0_1 + 8 >> 2] = 0;
   HEAP32[$0_1 + 36 >> 2] = 1;
   HEAP32[$0_1 + 24 >> 2] = $0_1 + 32;
   HEAP32[$0_1 + 40 >> 2] = $0_1 + 4;
   HEAP32[$0_1 + 32 >> 2] = $0_1;
   $26($0_1 + 8 | 0, 1049216);
   wasm2js_trap();
  }
  HEAP32[$1_1 + 8 >> 2] = $2_1;
  HEAP32[$0_1 + 12 >> 2] = 0;
  HEAP32[$0_1 + 8 >> 2] = $3_1;
  HEAP32[$0_1 + 16 >> 2] = $1_1;
  $1_1 = HEAP32[$1_1 + 4 >> 2];
  HEAP32[$0_1 + 4 >> 2] = $1_1 + ($2_1 << 3);
  HEAP32[$0_1 >> 2] = $1_1 + ($3_1 << 3);
 }

 function $20($0_1) {
  var $1_1 = 0;
  $1_1 = HEAP32[263011];
  HEAP32[263011] = $1_1 + 1;
  label$1 : {
   if (($1_1 | 0) < 0) {
    break label$1
   }
   $1_1 = HEAP32[263125] + 1 | 0;
   HEAP32[263125] = $1_1;
   if (!$0_1 | (HEAP32[263010] < 0 | $1_1 >>> 0 > 1) | $1_1 >>> 0 > 2) {
    break label$1
   }
   wasm2js_trap();
  }
  wasm2js_trap();
 }

 function $21($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0;
  $2_1 = global$0 - 16 | 0;
  global$0 = $2_1;
  $3_1 = HEAP32[$0_1 + 8 >> 2];
  if (HEAP32[$0_1 >> 2] - $3_1 >>> 0 < $1_1 >>> 0) {
   $11($2_1 + 8 | 0, $0_1, $3_1, $1_1);
   $29(HEAP32[$2_1 + 12 >> 2]);
  }
  global$0 = $2_1 + 16 | 0;
 }

 function $22() {
  var $0_1 = 0;
  $0_1 = global$0 - 32 | 0;
  global$0 = $0_1;
  HEAP32[$0_1 + 20 >> 2] = 1;
  HEAP32[$0_1 + 28 >> 2] = 0;
  HEAP32[$0_1 + 16 >> 2] = 1048624;
  HEAP32[$0_1 + 24 >> 2] = 1049456;
  HEAP32[$0_1 + 8 >> 2] = 0;
  $26($0_1 + 8 | 0, 1048632);
  wasm2js_trap();
 }

 function $23($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0;
  $2_1 = HEAP32[$0_1 + 8 >> 2];
  if (($2_1 | 0) == HEAP32[$0_1 >> 2]) {
   $3_1 = global$0 - 32 | 0;
   global$0 = $3_1;
   $2_1 = $2_1 + 1 | 0;
   $4_1 = 0;
   label$2 : {
    if (!$2_1) {
     break label$2
    }
    $4_1 = HEAP32[$0_1 >> 2];
    $5_1 = $4_1 << 1;
    $2_1 = $2_1 >>> 0 < $5_1 >>> 0 ? $5_1 : $2_1;
    $2_1 = $2_1 >>> 0 <= 4 ? 4 : $2_1;
    $5_1 = $2_1 << 3;
    $6_1 = ($2_1 >>> 0 < 268435456) << 3;
    label$3 : {
     if ($4_1) {
      HEAP32[$3_1 + 24 >> 2] = 8;
      HEAP32[$3_1 + 20 >> 2] = $4_1 << 3;
      HEAP32[$3_1 + 16 >> 2] = HEAP32[$0_1 + 4 >> 2];
      break label$3;
     }
     HEAP32[$3_1 + 24 >> 2] = 0;
    }
    $10($3_1, $5_1, $6_1, $3_1 + 16 | 0);
    $4_1 = HEAP32[$3_1 + 8 >> 2];
    if (HEAP32[$3_1 >> 2]) {
     break label$2
    }
    $4_1 = HEAP32[$3_1 + 4 >> 2];
    HEAP32[$0_1 >> 2] = $2_1;
    HEAP32[$0_1 + 4 >> 2] = $4_1;
    $4_1 = -2147483647;
   }
   $29($4_1);
   global$0 = $3_1 + 32 | 0;
   $2_1 = HEAP32[$0_1 + 8 >> 2];
  }
  HEAP32[$0_1 + 8 >> 2] = $2_1 + 1;
  $0_1 = HEAP32[$0_1 + 4 >> 2] + ($2_1 << 3) | 0;
  HEAP32[$0_1 >> 2] = $1_1;
  HEAP32[$0_1 + 4 >> 2] = 0;
 }

 function $24($0_1, $1_1, $2_1, $3_1) {
  var $4_1 = 0;
  label$1 : {
   label$2 : {
    if (($2_1 | 0) != 1114112) {
     $4_1 = 1;
     if (FUNCTION_TABLE[HEAP32[$1_1 + 16 >> 2]]($0_1, $2_1) | 0) {
      break label$2
     }
    }
    if ($3_1) {
     break label$1
    }
    $4_1 = 0;
   }
   return $4_1;
  }
  return FUNCTION_TABLE[HEAP32[$1_1 + 12 >> 2]]($0_1, $3_1, 0) | 0;
 }

 function $25() {
  var $0_1 = 0, $1_1 = 0;
  $0_1 = HEAP32[263046];
  if ($0_1) {
   while (1) {
    $1_1 = $1_1 + 1 | 0;
    $0_1 = HEAP32[$0_1 + 8 >> 2];
    if ($0_1) {
     continue
    }
    break;
   }
  }
  HEAP32[263124] = $1_1 >>> 0 <= 4095 ? 4095 : $1_1;
 }

 function $26($0_1, $1_1) {
  var $2_1 = 0;
  $2_1 = global$0 - 32 | 0;
  global$0 = $2_1;
  HEAP8[$2_1 + 24 | 0] = 1;
  HEAP32[$2_1 + 20 >> 2] = $1_1;
  HEAP32[$2_1 + 16 >> 2] = $0_1;
  HEAP32[$2_1 + 12 >> 2] = 1048716;
  HEAP32[$2_1 + 8 >> 2] = 1049456;
  $0_1 = global$0 - 16 | 0;
  global$0 = $0_1;
  $1_1 = $2_1 + 8 | 0;
  $2_1 = HEAP32[$1_1 + 8 >> 2];
  if (!$2_1) {
   $0_1 = global$0 - 32 | 0;
   global$0 = $0_1;
   HEAP32[$0_1 + 12 >> 2] = 1;
   HEAP32[$0_1 + 20 >> 2] = 0;
   HEAP32[$0_1 + 16 >> 2] = 1049456;
   HEAP32[$0_1 >> 2] = 0;
   HEAP32[$0_1 + 28 >> 2] = 43;
   HEAP32[$0_1 + 24 >> 2] = 1049456;
   HEAP32[$0_1 + 8 >> 2] = $0_1 + 24;
   $26($0_1, 1049528);
   wasm2js_trap();
  }
  HEAP32[$0_1 + 8 >> 2] = HEAP32[$1_1 + 12 >> 2];
  HEAP32[$0_1 + 4 >> 2] = $1_1;
  HEAP32[$0_1 >> 2] = $2_1;
  $1_1 = global$0 - 16 | 0;
  global$0 = $1_1;
  HEAP32[$1_1 + 8 >> 2] = HEAP32[$0_1 + 8 >> 2];
  $2_1 = HEAP32[$0_1 + 4 >> 2];
  HEAP32[$1_1 >> 2] = HEAP32[$0_1 >> 2];
  HEAP32[$1_1 + 4 >> 2] = $2_1;
  $0_1 = HEAP32[$1_1 >> 2];
  $2_1 = HEAP32[$0_1 + 20 >> 2];
  label$2 : {
   label$3 : {
    switch (HEAP32[$0_1 + 12 >> 2]) {
    case 0:
    case 1:
     break label$3;
    default:
     break label$2;
    };
   }
   if ($2_1) {
    break label$2
   }
   $20(HEAPU8[HEAP32[$1_1 + 4 >> 2] + 16 | 0]);
   wasm2js_trap();
  }
  $20(HEAPU8[HEAP32[$1_1 + 4 >> 2] + 16 | 0]);
  wasm2js_trap();
 }

 function $27($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0;
  $2_1 = HEAP32[$1_1 >> 2];
  if (($2_1 | 0) != HEAP32[$1_1 + 4 >> 2]) {
   HEAP32[$1_1 >> 2] = $2_1 + 1;
   $3_1 = 1;
  }
  HEAP32[$0_1 + 4 >> 2] = $2_1;
  HEAP32[$0_1 >> 2] = $3_1;
 }

 function $28($0_1) {
  $0_1 = $0_1 | 0;
  label$1 : {
   if ($0_1 >>> 0 > 2147483644) {
    break label$1
   }
   if (!$0_1) {
    return 4
   }
   $0_1 = $0($0_1);
   if (!$0_1) {
    break label$1
   }
   return $0_1 | 0;
  }
  wasm2js_trap();
 }

 function $29($0_1) {
  label$1 : {
   if (($0_1 | 0) != -2147483647) {
    if (!$0_1) {
     break label$1
    }
    wasm2js_trap();
   }
   return;
  }
  $22();
  wasm2js_trap();
 }

 function $30($0_1, $1_1, $2_1) {
  if ($1_1) {
   $2_1 = $0($1_1)
  }
  HEAP32[$0_1 + 4 >> 2] = $1_1;
  HEAP32[$0_1 >> 2] = $2_1;
 }

 function $31($0_1, $1_1) {
  if ($0_1) {
   $32($1_1, $0_1 << 3)
  }
 }

 function $32($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  if ($1_1) {
   $5($0_1)
  }
 }

 function $33($0_1, $1_1, $2_1) {
  var wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  (wasm2js_i32$0 = $0_1, wasm2js_i32$1 = $13(HEAP32[$0_1 >> 2], HEAP32[$0_1 + 4 >> 2], $1_1, $2_1)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
  HEAP32[$0_1 + 4 >> 2] = i64toi32_i32$HIGH_BITS;
 }

 function $34($0_1) {
  $0_1 = $0_1 | 0;
  global$0 = global$0 + $0_1 | 0;
  return global$0 | 0;
 }

 function $35($0_1, $1_1) {
  var $2_1 = 0, $3_1 = 0;
  if ($1_1 >>> 0 > 15) {
   $2_1 = 0 - $0_1 & 3;
   $3_1 = $2_1 + $0_1 | 0;
   if ($2_1) {
    while (1) {
     HEAP8[$0_1 | 0] = 0;
     $0_1 = $0_1 + 1 | 0;
     if ($3_1 >>> 0 > $0_1 >>> 0) {
      continue
     }
     break;
    }
   }
   $1_1 = $1_1 - $2_1 | 0;
   $2_1 = $1_1 & -4;
   $0_1 = $2_1 + $3_1 | 0;
   if (($2_1 | 0) > 0) {
    while (1) {
     HEAP32[$3_1 >> 2] = 0;
     $3_1 = $3_1 + 4 | 0;
     if ($3_1 >>> 0 < $0_1 >>> 0) {
      continue
     }
     break;
    }
   }
   $1_1 = $1_1 & 3;
  }
  if ($1_1) {
   $1_1 = $0_1 + $1_1 | 0;
   while (1) {
    HEAP8[$0_1 | 0] = 0;
    $0_1 = $0_1 + 1 | 0;
    if ($1_1 >>> 0 > $0_1 >>> 0) {
     continue
    }
    break;
   };
  }
 }

 function $36($0_1, $1_1, $2_1) {
  var $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0;
  $6_1 = $2_1;
  label$1 : {
   if ($2_1 >>> 0 <= 15) {
    $2_1 = $0_1;
    break label$1;
   }
   $3_1 = 0 - $0_1 & 3;
   $4_1 = $3_1 + $0_1 | 0;
   if ($3_1) {
    $2_1 = $0_1;
    $5_1 = $1_1;
    while (1) {
     HEAP8[$2_1 | 0] = HEAPU8[$5_1 | 0];
     $5_1 = $5_1 + 1 | 0;
     $2_1 = $2_1 + 1 | 0;
     if ($4_1 >>> 0 > $2_1 >>> 0) {
      continue
     }
     break;
    };
   }
   $8_1 = $6_1 - $3_1 | 0;
   $7_1 = $8_1 & -4;
   $2_1 = $7_1 + $4_1 | 0;
   $3_1 = $1_1 + $3_1 | 0;
   $6_1 = $3_1 & 3;
   label$5 : {
    if ($6_1) {
     if (($7_1 | 0) <= 0) {
      break label$5
     }
     $5_1 = $3_1 & -4;
     $1_1 = $5_1 + 4 | 0;
     $9_1 = $6_1 << 3;
     $6_1 = 0 - $9_1 & 24;
     $5_1 = HEAP32[$5_1 >> 2];
     while (1) {
      $10_1 = $5_1 >>> $9_1 | 0;
      $5_1 = HEAP32[$1_1 >> 2];
      HEAP32[$4_1 >> 2] = $10_1 | $5_1 << $6_1;
      $1_1 = $1_1 + 4 | 0;
      $4_1 = $4_1 + 4 | 0;
      if ($4_1 >>> 0 < $2_1 >>> 0) {
       continue
      }
      break;
     };
     break label$5;
    }
    if (($7_1 | 0) <= 0) {
     break label$5
    }
    $1_1 = $3_1;
    while (1) {
     HEAP32[$4_1 >> 2] = HEAP32[$1_1 >> 2];
     $1_1 = $1_1 + 4 | 0;
     $4_1 = $4_1 + 4 | 0;
     if ($4_1 >>> 0 < $2_1 >>> 0) {
      continue
     }
     break;
    };
   }
   $6_1 = $8_1 & 3;
   $1_1 = $3_1 + $7_1 | 0;
  }
  if ($6_1) {
   $3_1 = $2_1 + $6_1 | 0;
   while (1) {
    HEAP8[$2_1 | 0] = HEAPU8[$1_1 | 0];
    $1_1 = $1_1 + 1 | 0;
    $2_1 = $2_1 + 1 | 0;
    if ($3_1 >>> 0 > $2_1 >>> 0) {
     continue
    }
    break;
   };
  }
  return $0_1;
 }

 function $37($0_1, $1_1) {
  $0_1 = $13($0_1, $1_1, $0_1, $1_1);
  return $0_1;
 }

 function $38($0_1) {
  $0_1 = $0_1 | 0;
  i64toi32_i32$HIGH_BITS = 1285783348;
  return 180334249;
 }

 function $39($0_1) {
  $0_1 = $0_1 | 0;
 }

 function __wasm_ctz_i32($0_1) {
  if ($0_1) {
   return 31 - Math_clz32($0_1 - 1 ^ $0_1) | 0
  }
  return 32;
 }

 function __wasm_i64_mul($0_1, $1_1, $2_1, $3_1) {
  var $4_1 = 0, $5_1 = 0, $6_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0;
  $4_1 = $2_1 >>> 16 | 0;
  $5_1 = $0_1 >>> 16 | 0;
  $9_1 = Math_imul($4_1, $5_1);
  $6_1 = $2_1 & 65535;
  $7_1 = $0_1 & 65535;
  $8_1 = Math_imul($6_1, $7_1);
  $5_1 = ($8_1 >>> 16 | 0) + Math_imul($5_1, $6_1) | 0;
  $4_1 = ($5_1 & 65535) + Math_imul($4_1, $7_1) | 0;
  i64toi32_i32$HIGH_BITS = (Math_imul($1_1, $2_1) + $9_1 | 0) + Math_imul($0_1, $3_1) + ($5_1 >>> 16) + ($4_1 >>> 16) | 0;
  return $8_1 & 65535 | $4_1 << 16;
 }

 function __wasm_rotl_i32($0_1) {
  var $1_1 = 0;
  $1_1 = $0_1 & 31;
  $0_1 = 0 - $0_1 & 31;
  return (-1 >>> $1_1 & -2) << $1_1 | (-1 << $0_1 & -2) >>> $0_1;
 }

 bufferView = HEAPU8;
 initActiveSegments(imports);
 var FUNCTION_TABLE = [null, $3, $39, $38];
 function __wasm_memory_size() {
  return buffer.byteLength / 65536 | 0;
 }

 function __wasm_memory_grow(pagesToAdd) {
  pagesToAdd = pagesToAdd | 0;
  var oldPages = __wasm_memory_size() | 0;
  var newPages = oldPages + pagesToAdd | 0;
  if ((oldPages < newPages) && (newPages < 65536)) {
   var newBuffer = new ArrayBuffer(Math_imul(newPages, 65536));
   var newHEAP8 = new Int8Array(newBuffer);
   newHEAP8.set(HEAP8);
   HEAP8 = new Int8Array(newBuffer);
   HEAP16 = new Int16Array(newBuffer);
   HEAP32 = new Int32Array(newBuffer);
   HEAPU8 = new Uint8Array(newBuffer);
   HEAPU16 = new Uint16Array(newBuffer);
   HEAPU32 = new Uint32Array(newBuffer);
   HEAPF32 = new Float32Array(newBuffer);
   HEAPF64 = new Float64Array(newBuffer);
   buffer = newBuffer;
   bufferView = HEAPU8;
  }
  return oldPages;
 }

 return {
  "memory": Object.create(Object.prototype, {
   "grow": {
    "value": __wasm_memory_grow
   },
   "buffer": {
    "get": function () {
     return buffer;
    }

   }
  }),
  "ext_rescue_prime_hash": $2,
  "__wbindgen_add_to_stack_pointer": $34,
  "__wbindgen_malloc": $28,
  "__wbindgen_free": $32
 };
}

var retasmFunc = asmFunc({
});
export var memory = retasmFunc.memory;
export var ext_rescue_prime_hash = retasmFunc.ext_rescue_prime_hash;
export var __wbindgen_add_to_stack_pointer = retasmFunc.__wbindgen_add_to_stack_pointer;
export var __wbindgen_malloc = retasmFunc.__wbindgen_malloc;
export var __wbindgen_free = retasmFunc.__wbindgen_free;

