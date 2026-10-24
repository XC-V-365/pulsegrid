# PulseGrid Binary `.pgbin` (v6)

```
Offset  Size  Field
0       4     Magic big-endian 0x50473036 ("PG06")
4       2     BPM uint16 LE
6       2     Swing uint16 LE (0–75)
8       8     Four uint16 LE masks: kick, snare, hat, perc
16      128   For each of 4 tracks × 16 steps: uint8 vel, uint8 prob
```

Total **144 bytes**.
