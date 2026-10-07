plugins {
    id("com.android.application")
}

val releaseStorePath = providers.environmentVariable("ANDROID_KEYSTORE_PATH")
val releaseStorePassword = providers.environmentVariable("ANDROID_KEYSTORE_PASSWORD")
val releaseKeyAlias = providers.environmentVariable("ANDROID_KEY_ALIAS")
val releaseKeyPassword = providers.environmentVariable("ANDROID_KEY_PASSWORD")
val playVersionCode = providers.environmentVariable("PLAY_VERSION_CODE").orNull?.toIntOrNull() ?: 1
val playVersionName = providers.environmentVariable("PLAY_VERSION_NAME").orNull?.takeIf { it.isNotBlank() } ?: "1.0.0"

android {
    namespace = "com.skyare.pokerinno.academy"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.skyare.pokerinno.academy"
        minSdk = 24
        targetSdk = 36
        versionCode = playVersionCode
        versionName = playVersionName
    }

    sourceSets {
        getByName("main") {
            assets.srcDir("../../dist")
        }
    }

    signingConfigs {
        create("release") {
            if (releaseStorePath.isPresent &&
                releaseStorePassword.isPresent &&
                releaseKeyAlias.isPresent &&
                releaseKeyPassword.isPresent
            ) {
                storeFile = file(releaseStorePath.get())
                storePassword = releaseStorePassword.get()
                keyAlias = releaseKeyAlias.get()
                keyPassword = releaseKeyPassword.get()
            }
        }
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            if (releaseStorePath.isPresent) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.17.1")
}
