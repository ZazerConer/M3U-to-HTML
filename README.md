## Convert M3U playlist to HTML

<br>

This is a simple method to convert **M3U** playlists to **HTML**.

<br>

### M3U playlist

<br>

**Example:**

```txt
#EXTM3U
#EXTINF:-1, Stream Name 1
http://video-stream-1.m3u8
#EXTINF:-1, Stream Name 2
http://video-stream-2.m3u8
```

<br>

**Load the URL file** > <a href="https://github.com/ZazerConer/M3U-to-HTML/blob/7cfc506fd15e09abf0f4921010ddd74bbdbcc9dc/dist/index.html#L33">html#33</a>

```js
M3U_load("http://file-playlist.m3u");
```

This only supports **URL** files and **local** files are not accepted.

<br>

**Recommended max file size:**

`300kb` or less / `1000` channel list and below.

If you load files that exceed the above `size`, it may take a long time and slow to get data from **M3U** playlist.

<br>

**Required data** > <a href="https://github.com/ZazerConer/M3U-to-HTML/blob/7cfc506fd15e09abf0f4921010ddd74bbdbcc9dc/dist/file/script.js#L30">js#30</a>

_Channels_:

- `Logos`.
- `Name`.
- `URLs`.
