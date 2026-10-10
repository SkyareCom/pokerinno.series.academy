plugins { id("com.android.application") }

android {
    namespace = "com.skyare.stackupacademy"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.skyare.stackupacademy"
        minSdk = 24
        targetSdk = 35
        versionCode = providers.gradleProperty("releaseVersionCode").orElse("236").get().toInt()
        versionName = providers.gradleProperty("releaseVersionName").orElse("2.2.0").get()
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.13.0")
    implementation("androidx.activity:activity:1.10.1")
}
