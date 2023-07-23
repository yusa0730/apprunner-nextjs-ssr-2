import { useEffect, useState } from 'react';
import AWS, { CognitoIdentityServiceProvider } from 'aws-sdk';

AWS.config.credentials = new AWS.Credentials({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY_ID,
});

// AWS Config
const region = 'ap-northeast-1';
const userPoolId =  process.env.NEXT_PUBLIC_USER_POOL_ID;
console.log("=====test====");
console.log(process.env.NEXT_PUBLIC_ACCESS_KEY_ID);
console.log(process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY_ID);
console.log(userPoolId);
console.log("=====test====");

const targetEmail = 'ishizawa5226@yahoo.co.jp';

const cognito = new CognitoIdentityServiceProvider({ region });
const lambda = new AWS.Lambda({ region });

export default function FirstPost() {
  const [userAttributes, setUserAttributes] = useState(null);

  const getUser = async () => {
    // メールアドレスでユーザーを検索
    const listUsersResponse = await cognito.listUsers({
      UserPoolId: userPoolId,
      Filter: `email = "${targetEmail}"`,
    }).promise();

    // ユーザーが見つかったかチェック
    if (listUsersResponse.Users.length > 0) {
      const user = listUsersResponse.Users[0];

      // ユーザーの詳細を取得
      const userAttributesResponse = await cognito.adminGetUser({
        UserPoolId: userPoolId,
        Username: user.Username,
      }).promise();

      // ユーザーの属性を返す
      // return userAttributesResponse.UserAttributes;
      setUserAttributes(userAttributesResponse.UserAttributes[0]);
    }
  };

  const getLambda = async () => {
    // Define the Lambda function name and the payload
    const functionName = 'leadhack_test';
    const payload = {
      key1: 'value1',
      key2: 'value2',
      // ...
    };

    // Define the parameters for the Lambda invocation
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(payload),
    };

    // Invoke the Lambda function
    lambda.invoke(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Lambda function result:', data);
      }
    });
  };

  useEffect(() => {
    if (userAttributes) {
      console.log(userAttributes);
    }
  }, [userAttributes]);

  return (
    <div>
      <title>最初の投稿</title>
      <h1>最初の投稿</h1>
      <button onClick={getUser}>
        Get User Attributes
      </button>
      <br/>
      <button onClick={getLambda}>
        Get Lambda hello world
      </button>
    </div>
  );
}
