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