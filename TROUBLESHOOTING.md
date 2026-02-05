# PROBLEMA: Node.js está sendo bloqueado

## Sintomas
- `npm run dev` diz "Ready" mas não responde
- Processo Node.js morre imediatamente
- Porta não abre (Test-NetConnection falha)
- Python server também é interrompido com KeyboardInterrupt

## Causa
Algo no Windows está matando processos Node.js quando tentam abrir portas de rede.

## Soluções

### 1. Desabilitar Windows Defender Real-time Protection (temporariamente)
```powershell
# Como Administrador:
Set-MpPreference -DisableRealtimeMonitoring $true
```

### 2. Adicionar exceção ao Firewall
```powershell
# Como Administrador:
netsh advfirewall firewall add rule name="Node.js Dev" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes
```

### 3. Adicionar exceção ao Windows Defender
```powershell
# Como Administrador:
Add-MpPreference -ExclusionPath "C:\Users\joaob\OneDrive\Desktop\BetArena"
Add-MpPreference -ExclusionProcess "node.exe"
```

### 4. Mover projeto para fora do OneDrive
OneDrive pode estar bloqueando arquivos em sincronização:
```powershell
cd C:\
mkdir Dev
xcopy "C:\Users\joaob\OneDrive\Desktop\BetArena" "C:\Dev\BetArena" /E /I /H
cd C:\Dev\BetArena\apps\web
npm install
npm run dev
```

### 5. Verificar software de controlo parental
Se houver Qustodio, Norton Family, Kaspersky Safe Kids, etc., desativa temporariamente.

### 6. Executar terminal como Administrador
1. Clica direito no VS Code
2. "Run as Administrator"
3. Tenta `npm run dev` novamente

## Deploy Alternativo (se nada funcionar localmente)

### Opção A: Vercel
```bash
npm install -g vercel
cd c:\Users\joaob\OneDrive\Desktop\BetArena\apps\web
vercel
```

### Opção B: Netlify
```bash
npm install -g netlify-cli
cd c:\Users\joaob\OneDrive\Desktop\BetArena\apps\web
netlify dev
```

## Diagnóstico Adicional
```powershell
# Verificar processos que podem estar bloqueando:
Get-Process | Where-Object {$_.ProcessName -like "*defender*" -or $_.ProcessName -like "*kaspersky*" -or $_.ProcessName -like "*norton*" -or $_.ProcessName -like "*mcafee*"}

# Ver eventos de segurança recentes:
Get-EventLog -LogName Security -Newest 10 | Where-Object {$_.Message -like "*node*"}
```
