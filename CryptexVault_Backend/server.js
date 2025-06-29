const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');
const mime = require('mime-types');
const AutoIncrementFactory =require( 'mongoose-sequence');

// Initialize AutoIncrement
const AutoIncrement = AutoIncrementFactory(mongoose);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fileUpload', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const fileSchema = new mongoose.Schema({
    filename: String,
    hash: String,
    data: Buffer,
    owner: String,
}, { timestamps: true }); // This adds `createdAt` and `updatedAt`


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String
});

const LogSchema = new mongoose.Schema({
    type: {
      type: String,
      required: true,
    },
    asset: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      default: null,
    },
    to: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['success', 'failure', 'pending'],
      required: true,
    },
    userAddress: {
      type: String,
      default: null,
    },
  }, {
    timestamps: true,
  });
  
  // Add auto-incrementing id field
  LogSchema.plugin(AutoIncrement, { inc_field: 'id' });
  
  const Log = mongoose.model('Log', LogSchema);


const File = mongoose.model('File', fileSchema);
const User =mongoose.model('User',userSchema);
const app = express();
app.use(express.json());
app.use(cors());





const {Web3} = require("web3");
const fs = require("fs");


// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// Load contract artifacts
function loadContract(contractName) {
  const artifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, `../truffle/build/contracts/${contractName}.json`))
  );
  return {
    abi: artifact.abi,
    address: artifact.networks[Object.keys(artifact.networks)[0]].address,
  };
}

// Load all contracts
const Storage = loadContract("StorageContract");
const Verification = loadContract("VerificationContract");
const Transfer = loadContract("TransferContract");
const Delete = loadContract("DeleteContract");
const Upload = loadContract("UploadContract");

// Instantiate contracts
const storageContract = new web3.eth.Contract(Storage.abi, Storage.address);
const verificationContract = new web3.eth.Contract(Verification.abi, Verification.address);
const transferContract = new web3.eth.Contract(Transfer.abi, Transfer.address);
const deleteContract = new web3.eth.Contract(Delete.abi, Delete.address);
const uploadContract = new web3.eth.Contract(Upload.abi, Upload.address);



// Multer setup (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Endpoint: Upload any file (file, pdf, audio, etc.) with owner information
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file || !req.body.owner) {
            return res.status(400).json({ error: 'File and owner information are required.' });
        }

        const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
        const sampleHash = Buffer.from(hash, 'hex');

        const existingOwner = await storageContract.methods.getOwner(sampleHash).call();
        if (existingOwner !== '0x0000000000000000000000000000000000000000') {
            return res.status(400).json({ message: `This file is already copyrighted by: ${existingOwner}` });
        }

        await uploadContract.methods
            .uploadHash(sampleHash, req.body.owner)
            .send({ from: req.body.owner, gas: 300000 });

        const confirmedOwner = await storageContract.methods.getOwner(sampleHash).call();

        if (confirmedOwner.toLowerCase() === req.body.owner.toLowerCase()) {
            const newFile = new File({
                filename: req.file.originalname,
                hash,
                data: req.file.buffer,
                owner: req.body.owner
            });

            await newFile.save();

            //save log

            const newLog = new Log({
                type: 'upload',
                asset:  req.file.originalname,
                from: 'You',
                to: '0x00',
                date: new Date(Date.now()),
                status: 'success',
                userAddress:  req.body.owner,
              });
          
              await newLog.save();

            return res.status(200).json({
                message: 'File copyrighted successfully!',
                hash,
                id: newFile.id,
                timestamp: newFile.createdAt
            });
        } else {


            const newLog = new Log({
                type: 'upload',
                asset:  req.file.originalname,
                from: 'You',
                to: '0x00',
                date: new Date(Date.now()),
                status: 'failure',
                userAddress:  req.body.owner,
              });

              await newLog.save();
            return res.status(400).json({ error: 'Ownership validation failed after upload.' });
        }
    } catch (err) {
        console.error('Error during file upload:', err);
        return res.status(500).json({ error: 'Internal server error.', details: err.message });
    }
});

app.get('/files', async (req, res) => {
    try {
        const ethereumAddress = req.headers['ethereum-address'];

        if (!ethereumAddress) {
            return res.status(400).json({ error: "Ethereum address is required." });
        }

        console.log(`Request from Ethereum address: ${ethereumAddress}`);
        // Fetch and filter files if needed
        const files = await File.find({owner:ethereumAddress});
        res.json(files);
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ error: "Error fetching files." });
    }
});









// Endpoint: Verify ownership of an uploaded file
app.post('/verify', upload.single('file'), async (req, res) => {
    try {
        if (!req.file || !req.body.owner) {
            return res.status(400).json({ error: 'File and owner information are required for verification.' });
        }

        // Calculate the hash of the uploaded file
        const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
        console.log(hash)
        const sampleHash =  Buffer.from(hash, 'hex');

        const verificationResult = await verificationContract.methods
        .verifyOwnership(sampleHash, req.body.owner)
        .call();
       console.log(verificationResult)
        // Search for the file in the database
      
        
        // Check if the owner matches
        if (verificationResult) {
            const file = await File.findOne({ hash });
          // console.log(file)
            if (!file) {
                return res.status(404).json({ message: 'file not found in the database.' });
            }
            const fileUrl = `/file/${file.hash}`; // URL to fetch the file from the backend



            const newLog = new Log({
                type: 'verify',
                asset:  req.file.originalname,
                from: 'You',
                to: '0x00',
                date: new Date(Date.now()),
                status: 'success',
                userAddress:  req.body.owner,
              });

              await newLog.save();


            return res.json({ message: 'file ownership verified successfully! You own the  Coyright ', fileUrl });


        } else {

            const existingOwner = await storageContract.methods.getOwner(sampleHash).call();

            if(existingOwner!=0x00)
            {
           
            return res.status(200).json({ message: `This file is copyrighted to: ${existingOwner}.` ,owner:existingOwner,hash:hash});
            }else{
                console.log('returned 404')
                return res.status(404).json({ message: 'File not found on blockchain.' });

            }
        }
       
    
        

    } catch (err) {
        res.status(500).json({ error: 'Error verifying ownership.', details: err.message });
    }
});


// Endpoint: Transfer ownership of an file
app.put('/file/transfer/:hash', async (req, res) => {
    const { currentOwner, newOwner } = req.body;

    if (!currentOwner || !newOwner) {
        return res.status(400).json({ error: 'Both current and new owner addresses are required.' });
    }

    try {
        // Normalize addresses to lowercase (case-insensitive comparison)
        const normalizedCurrentOwner = currentOwner.toLowerCase();
        const normalizedNewOwner = newOwner.toLowerCase();

        // Find the file by hash
        const file = await File.findOne({ hash: req.params.hash });

        if (!file) {
            return res.status(404).json({ error: 'file not found.' });
        }
        console.log("file found")

        // Check if the current owner matches the file owner (case-insensitive comparison)
        if (file.owner.toLowerCase() !== normalizedCurrentOwner) {
            return res.status(200).json({ error: 'You are not authorized to transfer ownership of this file.' });
        }

        // Call the smart contract to transfer ownership
        const uploader = normalizedCurrentOwner;

        const sampleHash = Buffer.from(req.params.hash, 'hex');
        
        const transferResult = await transferContract.methods
            .transferOwnership(sampleHash, normalizedNewOwner)
            .send({ from: uploader, gas: 300000 });

        if (transferResult) {
            // Update the database with the new owner
            file.owner = normalizedNewOwner;
            await file.save();
        
            const newLog = new Log({
                type: 'transfer',
                asset:  file.filename,
                from: 'You',
                to: normalizedNewOwner,
                date: new Date(Date.now()),
                status: 'success',
                userAddress:  currentOwner,
              });
            
              
              await newLog.save();
            // Respond with a success message
            res.json({ message: 'Ownership transferred successfully.', newOwner: file.owner });
        } else {
            res.status(400).json({ error: 'Failed to transfer ownership on the blockchain.' });
        }

    } catch (err) {
        console.error('Error transferring ownership:', err);
        res.status(500).json({ error: 'Error transferring ownership.', details: err.message });
    }
});


// User update/create endpoint (upsert operation)
app.put('/api/users/:ethereumAddress', async (req, res) => {
    try {
      const { ethereumAddress } = req.params;
      const { username, email } = req.body;
      
      // Validate input
      if (!ethereumAddress) {
        return res.status(400).json({ 
          error: 'Ethereum address is required' 
        });
      }
      
      // Normalize ethereum address to lowercase
      const normalizedAddress = ethereumAddress.toLowerCase();
      console.log(normalizedAddress);
      // Find user by ethereum address
      let user = await User.findOne({ address: normalizedAddress });
      
      if (user) {
        // User exists - update fields
        if (username) user.name = username;
        if (email) user.email = email;
        
        await user.save();
        
        return res.status(200).json({
          message: 'User updated successfully',
          user
        });
      } else {
        // User doesn't exist - create new user
        const newUser = new User({
          address: normalizedAddress,
          name: username || 'Anonymous User',
          email: email || ''
        });
        
        await newUser.save();
        
        return res.status(200).json({
          message: 'User created successfully',
          user: newUser  
        });
      }
    } catch (error) {
      console.error('Error in user upsert operation:', error);
      return res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  });
  

// GET /api/users/:walletAddress
app.get('/api/users/:walletAddress', async (req, res) => {
    try {
      const walletAddress = req.params.walletAddress.toLowerCase();
  
      // Find user by normalized wallet address
      const user = await User.findOne({ address: walletAddress });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Send user data (adjust fields as needed)
      res.json({
        user: {
          name: user.name,
          email: user.email
        }
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/activity/:walletAddress
app.get('/api/activity/:walletAddress', async (req, res) => {
    try {
      const walletAddress = req.params.walletAddress.toLowerCase();
       console.log('searching:',walletAddress);
      // Find recent activity logs for this wallet address, sorted by date descending
      const activities = await Log.find({ userAddress: walletAddress })
        .sort({ date: -1 })
        .limit(); // Limit to latest 20 activities
   console.log(activities)
      res.json({ activities });
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      res.status(500).json({ error: 'Failed to fetch recent activity' });
    }
  });

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});