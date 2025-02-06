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
                                 <p>Please review the building logs and approve or reject the deployment for the app.</p>
                                 <p><a href="https://c180-115-99-175-167.ngrok-free.app/job/frontendCICD/">Approve Deployment</a></p>
                                 <p><a href="https://c180-115-99-175-167.ngrok-free.app/job/frontendCICD/">Reject Deployment</a></p>
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
        always {
            // Clean up or other post steps
            echo 'Deployment process finished.'
        }
    }
}
