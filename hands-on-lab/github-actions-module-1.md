# GitHub Actions for  Power Platform: Hands-on Lab

## Module 1 - Building Basic Model Driven CDS App for Deployment using GitHub Actions

## Lab Scenario 
In this lab you will be creating a basic Model-driven app to use with Module 2 of the lab where you will learn how to automate the application lifecycle management of the app.

1.	Navigate to https://make.powerapps.com and sign in with your credentials.  Click the environment selector dropdown in the header and select your development environment.

![Select environment](media/gh-lab-1.10.gif "Select environment")

2.	Click the Solutions area in the left navigation then click the New solution button to create a new solution.

![New solution](media/gh-lab-1.20.gif "New solution")
 
3.	In the side panel that appears, enter a name for the application and click the dropdown for the publisher and click the Add Publisher option
**Note**: The solution publisher specifies who developed the app. For this reason, you should create a solution publisher name that is meaningful. Furthermore, the solution publisher includes a prefix, which helps you distinguish system components or components introduced by others and is also a mechanism to help avoid naming collisions. This allows for solutions from different publishers to be installed in an environment with minimal conflicts

![Create publisher](media/gh-lab-1.30.png "Create publisher")

4.	For the purposes of this lab, enter your ***ALMLab*** for the **display name, name, and prefix** and **click Save**.

​	![Create publisher](media/gh-lab-1.40.png "Create publisher")

5.	On the new solution panel, **select the publisher that you just created** and **click** **Create** to create a new unmanaged solution in the environment.

![New solution](media/gh-lab-1.50.png "New solution")

6.	In the solutions list, select the solution you just created click the **Edit** button.

![Edit solution](media/gh-lab-1.60.png "Edit solution")

7.	Your new solution will be empty, and you need to add components to it.  In this lab we will create a custom table. Click the **+ New** dropdown from the top navigation and select **Table**

![New tabl](media/gh-lab-1.70.png "New table")

8.	Enter a **display name**, plural name will be generated for you. Click **Save** to create the table.

![Create table](media/gh-lab-1.80.png "Create table")

9.	Once your table is created, click the solution name again to go back to the solution view to add another component

10.	Click the **+ New** dropdown, then **App**, and finally click **Model-driven app**. If you get a pop-up asking to select the creating experience choose *Modern app designer* 

![New app](media/gh-lab-1.100.png "New app")

11.	Enter an app name and click the **Create** button

![Enter app name](media/gh-lab-1.110.png "Enter app name")

12.	In the application designer, click **+ Add page**, choose **Table based view and form**, then click **Next**. On the next screen **search by name for the table you previously created**. **Check mark the selection** and click **Add**
    **Note:** Ensure that *Show in navigation* is checked

​	![Create basic app](media/gh-lab-1.120.gif "Create basic app")

13. Click **Publish**, once the publish action is complete click **Play**.
14. This will take you to the application so that you can see how it looks.  You can use the application and close the tab when you are satisfied.

![View app](media/gh-lab-1.180.png "View app")