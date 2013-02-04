# dir-remove (bundled task)

Deletes a directory and its contents.

## Options

<table>
	<tr>
		<th>Option</th>
		<th width="220px">Type</th>
		<th>Comment</th>
	</tr>
	<tr>
		<td valign="top"><code>path</code></td>
		<td valign="top"><code>string</code></td>
		<td valign="top">Directory path to remove.</td>
	</tr>
</table>

## Examples

```javascript
roto.addTask('dir-remove', {path: 'src/temp'});
```