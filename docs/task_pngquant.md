# pngquant (bundled task)

Compresses PNGs using pngquant.

## Options

<table>
	<tr>
		<th>Option</th>
		<th width="220px">Type</th>
		<th>Comment</th>
	</tr>
	<tr>
		<td valign="top"><code>files</code></td>
		<td valign="top"><code>string</code> (or <code>array</code> of strings)</td>
		<td valign="top">Paths of PNGs to be compressed. Supports basic wildcards / <a href="http://www.linuxjournal.com/content/bash-extended-globbing" target="_blank">glob syntax</a>.</td>
	</tr>
	<tr>
		<td valign="top"><code>ignore</code></td>
		<td valign="top"><code>string</code> (or <code>array</code> of strings)</td>
		<td valign="top">Any matching paths will be ignored. Also supports glob syntax.</td>
	</tr>
	<tr>
		<td valign="top"><code>binary</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Gives location of pngquant binary. Defaults to <code>./bin/pngquant</code>.</td>
	</tr>
	<tr>
		<td valign="top"><code>optipng</code></td>
		<td valign="top"><code>bool</code></td>
		<td valign="top">Compresses the images again using optipng. MUST BE INSTALLED GLOBALLY. (see below)</td>
	</tr>
	<tr>
		<td valign="top"><code>force</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Sets whether or not to overwrite existing files. If set to false, it will not overwrite.</td>
	</tr>
	<tr>
		<td valign="top"><code>verbose</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Provides the verbose output of pngquant.</td>
	</tr>
	<tr>
		<td valign="top"><code>suffix</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Determines name of the new png. (example: a suffix of <code>-quant.png</code> would make <code>apple.png</code> become <code>apple-quant.png</code>) Defaults to the same name as original.</td>
	</tr>
</table>

## Examples

```javascript
roto.addTask('pngquant', {
	files    : 'public/img/*.png',
	verbose  : true
});
```

## OptiPNG set-up

To compress your images even further, OptiPNG can be used. However, OptiPNG must be installed globally for it to function. Run in terminal:

    curl -L http://sourceforge.net/projects/optipng/files/OptiPNG/optipng-0.7.3/optipng-0.7.3.tar.gz/download -o optipng.tar.gz
    tar -xzvf optipng.tar.gz
    cd optipng-0.7.3
    sudo ./configure
    sudo make install
    optipng

If you get an output, yahoo! Set <code>optipng</code> to <code>true</code> in your build file, and you're ready!