# POKERINNO ACADEMY — Google Play foundation

## Identidade Android

- applicationId: `com.skyare.pokerinno.academy`
- namespace: `com.skyare.pokerinno.academy`
- versionCode: `1`
- versionName: `1.0.0`
- minSdk: `24`
- targetSdk / compileSdk: `36`

> O applicationId não deve ser alterado depois que o app for criado/publicado no Google Play.

## Arquitetura

O Android empacota diretamente o conteúdo de `dist/` como assets locais. O app abre:

`https://appassets.androidplatform.net/assets/index.html`

usando `WebViewAssetLoader`. Isso evita depender de GitHub Pages, RawGit, Githack ou outro host para iniciar o app.

## Build local

Requisitos:

- JDK 17
- Android SDK Platform 36
- Gradle 9.6

Com esses requisitos instalados:

```bash
npm test
gradle :android:app:bundleRelease
```

O bundle fica em:

`android/app/build/outputs/bundle/release/app-release.aab`

Sem variáveis de assinatura, o bundle serve para validar o build, mas não é o artefato final de upload.

## Assinatura para o Play

Configurar no GitHub Actions:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Com os quatro secrets presentes, o workflow gera o AAB assinado com a chave de upload.

## Antes da produção

Ainda precisam ser confirmados antes do envio público:

1. Tela de login e autenticação real (Google, biometria e StackUp ID).
2. Política de privacidade pública.
3. Declaração de segurança de dados no Play Console.
4. Conteúdo, faixa etária e classificação.
5. Ícone final e artes de loja aprovadas.
6. Capturas de tela / feature graphic.
7. Teste do AAB em faixa interna/fechada.
8. Incrementar `versionCode` a cada novo upload.
