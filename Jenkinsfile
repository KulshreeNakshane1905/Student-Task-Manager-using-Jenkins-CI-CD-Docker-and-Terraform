pipeline {
    agent any
    environment {
        APP_IMAGE = 'student-task-manager'
        APP_CONTAINER = 'student-task-manager'
        APP_PORT = '3000'
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install Dependencies') {
            steps { sh 'npm ci' }
        }
        stage('Test') {
            steps { sh 'npm test' }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${APP_IMAGE}:${BUILD_NUMBER} .'
                sh 'docker tag ${APP_IMAGE}:${BUILD_NUMBER} ${APP_IMAGE}:latest'
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f ${APP_CONTAINER} || true
                    docker run -d --name ${APP_CONTAINER} --restart unless-stopped                       -p ${APP_PORT}:3000 -v student-task-data:/app/data ${APP_IMAGE}:latest
                '''
            }
        }
        stage('Smoke Test') {
            steps {
                sh '''
                    for attempt in $(seq 1 15); do
                      if curl --fail http://127.0.0.1:${APP_PORT}/health; then exit 0; fi
                      sleep 2
                    done
                    echo "Application health check failed"
                    exit 1
                '''
            }
        }
    }
    post {
        success { echo 'Student Task Manager pipeline completed successfully.' }
        failure { echo 'Pipeline failed. Review the stage logs.' }
    }
}
