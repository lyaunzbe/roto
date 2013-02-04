# dir-move (bundled task)

Moves a directory and its contents to a new location.

## Options

<table>
	<tr>
		<th>Option</th>
		<th width="220px">Type</th>
		<th>Comment</th>
	</tr>
	<tr>
		<td valign="top"><code>from</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Source path.</td>
	</tr>
	<tr>
		<td valign="top"><code>to</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Destination path.</td>
	</tr>
	<tr>
		<td valign="top"><code>preserve</code></td>
		<td valign="top"><code>bool</code></td>
		<td valign="top">If false, existing destination directory contents will be cleared.</td>
	</tr>
</table>

## Examples

```javascript
roto.addTask('dir-move', {
	from: 'src/images',
	to: 'build/images'
});
```