---
weight: 1
title: "InPlayOTA App Guide"
---

# InPlayOTA App Guide
## Introduction 
The InPlayOTA Android App is designed for Over-the-Air (OTA) firmware upgrades for the IN6XX and IN6XXE chips. This app allows users to easily update their devices' firmware, ensuring that they are running the latest features, improvements, and bug fixes. It provides a seamless process for upgrading the firmware without the need for physical connections, enhancing the convenience and efficiency of the update procedure.

## Preparation
- Build the OTA demo project and download the bin file to the DK.
- **Without Signature for Bin File:**
  Copy the updated bin file to your phone, for example, to the "Download" folder.
- (Optional)**With Signature for Bin File:**
  Use the Python script `ota_tool/ota_signature.py` to generate the updated bin file with the signature. Then, copy the bin file to your phone.

## Initial App Run - Granting Permissions

When you run the InPlayOTA app for the first time, you will be prompted to grant permissions. Please follow these steps:

1. Tap **"While using the app"**.
![](/images/ota_app/ota2.png)
2. Then tap **"Allow"**.
![](/images/ota_app/ota3.png)   

## Step

- Click the **Scan** button to search for available devices.
![](/images/ota_app/ota4.png)  
- (Optional)Click the **Filter** button to filter devices. Click it again to collapse the filter.
![](/images/ota_app/ota5.png)  
- Find the device (e.g., "InPlay-OTA") and click the **Connect** button.
![](/images/ota_app/ota6.png)
- If the device status is not "CONNECTED," click **DISCONNECT** and then click **CONNECT** again.
![](/images/ota_app/ota1.png)
- Select the bin file from your phone.
![](/images/ota_app/ota9.png)
- (Optional) Click the **Options** button:
  ![](/images/ota_app/ota7.png)
  - **Hash:** Enable hash checking (only available for IN6XX chip).
  - **CRC32:** Enable CRC32 checking (only available for IN6XXE chip).
  - **AES Encrypt:** Deprecated setting, do not check.
  - **Flash Verify:** Verify flash data. This is not required if hash or CRC32 checking is enabled.
  - **Force Erase:** Deprecated setting.

- Click the **Start** button to begin the OTA process.
![](/images/ota_app/ota10.png)
The device will reset automatically once the OTA update is successful.
![](/images/ota_app/ota11.png)





