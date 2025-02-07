pipeline {
    agent any

    triggers {
        // This trigger listens for GitHub push events to automatically start the pipeline
        githubPush()
    }

    environment {
        // Define the Node.js home directory
        NODE_HOME = 'C:\\Program Files\\nodejs' // Update this path based on your Node.js installation
        PATH = "${NODE_HOME};${env.PATH}"      // Add Node.js to the PATH and retain existing PATH
        AZURE_APP_NAME = 'eshwar-test-02' // Replace with your Azure Web App name
        AZURE_RESOURCE_GROUP = 'eshwar' // Replace with your resource group 
        
        
        
        
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from your Git repository and specify the branch
                git branch: 'main', url: 'https://github.com/EshwarBashaBathini/frontend-loki.git', credentialsId : '2cfb3354-b0cc-4c3f-890f-b339640f685f'
            }
            post {
                success {
                    // Send email to Git Checkout team after successful checkout
                    emailext(
                        subject: "Git Checkout Success",
                        body: """<p>Dear Git Checkout Team,</p>
                                 <p>The repository has been successfully checked out for the frontend project.</p>
                                 <p>Regards,</p>
                                 <p>Your Jenkins Pipeline</p>""",
                        to: "manikanta@middlewaretalents.com",  // Replace with the Git Checkout team's email
                        from: 'eshwar.bashabathini88@gmail.com',
                        replyTo: 'eshwar.bashabathini88@gmail.com'
                    )
                }
                failure {
                    // Send email to Git Checkout team after failed checkout
                    emailext(
                        subject: "Git Checkout Failure",
                        body: """<p>Dear Git Checkout Team,</p>
                                 <p>The Git checkout has failed. Please check the build logs for more details.</p>
                                 <p>Regards,</p>
                                 <p>Your Jenkins Pipeline</p>""",
                        to: "manikanta@middlewaretalents.com",  // Replace with the Git Checkout team's email
                        from: 'eshwar.bashabathini88@gmail.com',
                        replyTo: 'eshwar.bashabathini88@gmail.com'
                    )
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js dependencies (Windows command)
                    bat 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    // Build the frontend application (Windows command)
                    bat 'npm run build'
                }
            }
        }
        
         // Stage to check if the ZIP file exists and delete it if present
        stage('Check and Delete Old ZIP') {
            steps {
                script {
                    // Check if the dist.zip file exists and delete it if present
                    bat '''
                    IF EXIST build.zip (
                        DEL /F /Q build.zip
                        echo "Old build.zip file deleted."
                    ) ELSE (
                        echo "No old build.zip file found."
                    )
                    '''
                }
            }
        }
        
        stage('Create ZIP File') {
            steps {
                script {
                    // Create a zip file of the build output (assuming build output is in "dist" folder)
                    // bat 'powershell -Command "Compress-Archive -Path dist\\* -DestinationPath dist.zip"'
                    // Alternatively, if the output directory is "build", use: 
                    bat 'powershell -Command "Compress-Archive -Path build\\* -DestinationPath build.zip"'
                }
            }
        }    
        // Manager Approval Stage
          stage('Manager Approval') {
            steps {
                script {
                    // Send email to manager notifying them about the approval request
                    emailext(
                        subject: "Approval Request for Deployment",
                        body:""" <p>Dear Manager,</p>
                                 <p>Please review the building logs of Frontend Project and Approve or Reject the deployment for the app.</p>
                                 <p style="margin-bottom: 15px;">
                                    <a href="https://e722-136-232-205-158.ngrok-free.app/job/frontendCICD/${env.BUILD_NUMBER}/input/"
                                       style="background-color: #4CAF50; color: white; padding: 14px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 18px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;">
                                       Approve Deployment
                                    </a>
                                </p>
                                <p style="margin-top: 15px;">
                                    <a href="https://e722-136-232-205-158.ngrok-free.app/job/frontendCICD/${env.BUILD_NUMBER}/input/"
                                       style="background-color: #f44336; color: white; padding: 14px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 18px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;">
                                       Reject Deployment
                                    </a>
                                </p>
                                 <p>Kind Regards,</p>
                                 <p>Your Jenkins Pipeline</p>""",
                        to: "eshwar@middlewaretalents.com",  // Manager's email
                        from: 'eshwar.bashabathini88@gmail.com',  // Your email (Gmail, if using SMTP correctly configured)
                        replyTo: 'eshwar.bashabathini88@gmail.com',  // Reply-to address
                        attachLog: true  // Optionally attaches the build log
                    )
                }
                
                // Requesting manager approval via Jenkins input
                script {
                    // Collecting approval decision from the manager
                    def approval = input(
                        message: 'Do you approve the deployment to Azure?', 
                        parameters: [
                            choice(name: 'Approval', choices: ['Approve', 'Reject'], description: 'Manager Approval')
                        ]
                    )

                    // Print the decision for debugging purposes
                    echo "Manager's Approval status 01: ${approval}"

                    // Assign the value of approval to the variable
                    env.APPROVAL_STATUS = approval
                }
            }
        } 
          
        stage('Deploying to Azure ') {
            steps {
                script {
                    if (env.APPROVAL_STATUS == 'Reject') {
                        echo "Deployment was rejected by the manager. Skipping deployment."
                    } else if (env.APPROVAL_STATUS == 'Approve') {
                        // Log in using service principal
                        script {
                            withCredentials([  // Access Azure secrets from GitHub's secret manager (Jenkins Credentials)
                                string(credentialsId: 'CLIENT_ID', variable: 'CLIENT_ID'), 
                                string(credentialsId: 'CLIENT_PASSWORD', variable: 'CLIENT_PASSWORD'), 
                                string(credentialsId: 'TENANT_ID', variable: 'TENANT_ID') 
                            ]) {
                                // Azure login using service principal
                                bat """
                                    az login --service-principal -u ${CLIENT_ID} -p ${CLIENT_PASSWORD} --tenant ${TENANT_ID}
                                """
                            }
                        }
                        script {
                            // Ensure you have set up the Azure CLI plugin or other necessary Azure credentials
                            // Example: Using Azure CLI to deploy the ZIP file to Azure Web App
                            bat '''
                            az webapp deploy --resource-group eshwar --name eshwar-test-02 --src-path build.zip
                            '''
                        }
                    }
                }
            }
        }
    }
    post {
                success {
                    // Send email to Deployment team after successful deployment
                    emailext(
                        subject: "Deployment Success",
                        body: """<p>Dear Deployment Team,</p>
                                 <p>The frontend application has been successfully deployed to Azure Web App.</p>
                                 <p>Regards,</p>
                                 <p>Your Jenkins Pipeline</p>""",
                        to: "dhanasekhar@middlewaretalents.com",  // Replace with the Deployment team's email
                        from: 'eshwar.bashabathini88@gmail.com',
                        replyTo: 'eshwar.bashabathini88@gmail.com'
                    )
                }
                failure {
                    // Send email to Deployment team after failed deployment
                    emailext(
                        subject: "Deployment Failure",
                        body: """<p>Dear Deployment Team,</p>
                                 <p>The frontend deployment to Azure Web App has failed. Please check the build logs for more details.</p>
                                 <p>Regards,</p>
                                 <p>Your Jenkins Pipeline</p>""",
                        to: "dhanasekhar@middlewaretalents.com",  // Replace with the Deployment team's email
                        from: 'eshwar.bashabathini88@gmail.com',
                        replyTo: 'eshwar.bashabathini88@gmail.com'
                    )
                }
            }
        }
    }
    post {
        always {
            // Send email to frontend team with build result (success/failure)
            script {
                def buildStatus = currentBuild.result ?: 'SUCCESS'  // Default to SUCCESS if not set
                def subject = "Frontend Build - ${buildStatus}"
                def body = buildStatus == 'SUCCESS' ? 
                            "<p>Dear Frontend Team,</p><p>The frontend build was successful.</p>" :
                            "<p>Dear Frontend Team,</p><p>The frontend build failed. Please check the logs for details.</p>"
                
                emailext(
                    subject: subject,
                    body: body,
                    to: "vamsi@middlewaretalents.com",  // Replace with the actual email of the frontend team
                    from: 'eshwar.bashabathini88@gmail.com',  // Your email
                    replyTo: 'eshwar.bashabathini88@gmail.com',  // Reply-to address
                    attachLog: true  // Optionally attaches the build log
                )
            }
        }
    }
}
