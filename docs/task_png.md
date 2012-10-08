# png (bundled task)

The catch-all PNG compression task. Supports PNGCrush, PNGQuant, and OptiPNG.

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
		<td valign="top">Paths of files to be concatenated. Supports basic wildcards / <a href="http://www.linuxjournal.com/content/bash-extended-globbing" target="_blank">glob syntax</a>.</td>
	</tr>
	<tr>
		<td valign="top"><code>ignore</code></td>
		<td valign="top"><code>string</code> (or <code>array</code> of strings)</td>
		<td valign="top">Any matching paths will be ignored. Also supports glob syntax.</td>
	</tr>
	<tr>
		<td valign="top"><code>compressor</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Defines which compressor to use. Accepts <code>pngcrush</code>, <code>pngquant</code> and <code>optipng</code>. Required.</td>
	</tr>
	<tr>
		<td valign="top"><code>binaries</code></td>
		<td valign="top"><code>object</code></td>
		<td valign="top">Provides path to each binary file of the compressors. Defaults to all being stored in <code>./bin/name</code>. Use format in example below.</td>
	</tr>
	<tr>
		<td valign="top"><code>workers</code></td>
		<td valign="top"><code>int</code></td>
		<td valign="top">How many concurrent files to run at once. Defaults at 1.</td>
	</tr>
</table>

## Examples

```javascript
roto.addTask('png', {
	files      : 'images/*.png'
	ignore     : 'images/not_me.png',
	compressor : 'pngquant',
	binaries   : {'pngquant': './custom/path/to/pngquant'},
	workers    : 5
});
```