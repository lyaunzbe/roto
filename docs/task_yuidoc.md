#yuidoc (bundled task)

The `yuidoc` task generates API documentation from comments in source, using familiar [syntax](http://yui.github.com/yuidoc/syntax/index.html).

## Options

<table>
	<tr>
		<th>Option</th>
		<th width="220px">Type</th>
		<th>Comment</th>
	</tr>
	<tr>
		<td valign="top"><code>project</code></td>
		<td valign="top"><code>object</code></td>
		<td valign="top">Contains project fields, like url, version, description, etc. <a href="http://yui.github.com/yuidoc/args/index.html#json">General YUIDoc Project Information</a>.</td>
	</tr>
	<tr>
		<td valign="top"><code>paths</code></td>
		<td valign="top"><code>Array</code></td>
		<td valign="top">An array of string path(s) to the files/dirs you would like to parse.</td>
	</tr>
	<tr>
		<td valign="top"><code>outdir</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">A string path where you want to output the generated documentation</td>
	</tr>
	<tr>
		<td valign="top"><code>exclude</code></td>
		<td valign="top"><code>Array</code></td>
		<td valign="top">An array of files (name and extension) that you don't want parsed.</td>
	</tr>
	<tr>
		<td valign="top"><code>ignorePaths</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Paths you want ignored.</td>
	</tr>

</table>

These are the most common options you will need, but YUIDoc does offer more specific options, which you can find in their [usage guide](http://yui.github.com/yuidoc/args/index.html). The majority of these are simple boolean options and are compatible with this task. 


## Examples

```javascript
roto.addTask('yuidoc',{
    project : {
        name : "Foo",
        description : "The Foo API: a library for doing X, Y, and Z",
        version : "1.2.1",
        url : "http://example.com/"
    },
    paths : ['./'],
    outdir : "./docs",
    ignorePaths: ['./docs', './test'].
    exclude : 'cli.js,secret.js'
});
```

```javascript
roto.addTask('yuidoc',{
    paths : ['./'],
    outdir : "./out",
    ignorePaths: ['./docs', './test', './theme'].
    exclude : 'cli.js,secret.js',
    quiet: true,
    selleck: true,
    themedir : "./theme"
});
```
