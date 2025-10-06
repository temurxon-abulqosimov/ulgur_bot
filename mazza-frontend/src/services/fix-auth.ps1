$content = Get-Content api.ts
for ($i = 0; $i -lt $content.Length; $i++) {
  if ($content[$i] -match "Bearer.*token") {
    $content[$i] = "      config.headers['Authorization'] = `Bearer `${token}`;"
    break
  }
}
$content | Set-Content api.ts
