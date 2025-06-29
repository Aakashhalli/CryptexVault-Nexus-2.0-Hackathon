const StorageContract = artifacts.require("StorageContract");
const VerificationContract = artifacts.require("VerificationContract");
const TransferContract = artifacts.require("TransferContract");
const DeleteContract = artifacts.require("DeleteContract");
const UploadContract = artifacts.require("UploadContract");

module.exports = async function (deployer) {
  // Step 1: Deploy the StorageContract
  await deployer.deploy(StorageContract);
  const storageInstance = await StorageContract.deployed();
  console.log(`StorageContract deployed at address: ${storageInstance.address}`);

  // Step 2: Deploy VerificationContract and pass the StorageContract address
  await deployer.deploy(VerificationContract, storageInstance.address);
  const verificationInstance = await VerificationContract.deployed();
  console.log(`VerificationContract deployed at address: ${verificationInstance.address}`);

  // Step 3: Deploy TransferContract and pass the StorageContract address
  await deployer.deploy(TransferContract, storageInstance.address);
  const transferInstance = await TransferContract.deployed();
  console.log(`TransferContract deployed at address: ${transferInstance.address}`);

  // Step 4: Deploy DeleteContract and pass the StorageContract address
  await deployer.deploy(DeleteContract, storageInstance.address);
  const deleteInstance = await DeleteContract.deployed();
  console.log(`DeleteContract deployed at address: ${deleteInstance.address}`);

  // Step 5: Deploy UploadContract and pass the StorageContract address
  await deployer.deploy(UploadContract, storageInstance.address);
  const uploadInstance = await UploadContract.deployed();
  console.log(`UploadContract deployed at address: ${uploadInstance.address}`);
};
