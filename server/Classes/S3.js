async function createBucket(bucketName, s3Client) {
  try {
    await s3Client.createBucket({ Bucket: bucketName }).promise();
    console.log(`Created bucket: ${bucketName}`);
  } catch (err) {
    // We will ignore 409 errors which indicate that the bucket already
    if (err.statusCode !== 409) {
      console.log(`Error creating bucket: ${err}`);
    }
  }
}

async function checkBucketExists(bucket, s3Client) {
  const options = {
    Bucket: bucket,
  };
  try {
    await s3Client.headBucket(options).promise();
    console.log(`Bucket ${bucket} in the S3`);
    return true;
  } catch (error) {
    if (error.statusCode === 404) {
      return false;
    }
    throw error;
  }
}

async function getS3Object(bucketName, keyName, s3Client) {
  try {
    const params = { Bucket: bucketName, Key: keyName };
    const s3Result = await s3Client.getObject(params).promise();
    const s3JSON = JSON.parse(s3Result.Body);
    console.log(`Get ${keyName} successfully from S3 ${keyName}`);
    return s3JSON;
  } catch (err) {
    console.log(
      `Failed to get ${keyName}, error status code is ${err.statusCode}`
    );
    return false;
  }
}

async function putS3Object(bucketName, keyName, date, s3Client) {
  try {
    const body = JSON.stringify(date);
    const objectParams = { Bucket: bucketName, Key: keyName, Body: body };
    await s3Client.putObject(objectParams).promise();
    console.log(`Save ${keyName} successfully to S3 ${keyName}`);
  } catch (err) {
    console.log(
      `Failed to get ${keyName} from S3, error status code is ${err.statusCode}`
    );
    throw err;
  }
}

exports.putS3Object = putS3Object;
exports.getS3Object = getS3Object;
exports.createBucket = createBucket;
exports.checkBucketExists = checkBucketExists;
