pipeline {
    agent {
        docker {
            image 'node:10'
        }
    }

    stages {
        stage('init') {
            steps {
                sh 'npm config set registry https://registry.npm.taobao.org & npm install'
            }
        }
        stage('game') {
            when {
                changeset "game/**/*"
            }
            steps {
                dir("game") {
                    sh "npm run update"
                }
            }
        }
    }
}