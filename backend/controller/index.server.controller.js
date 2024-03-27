exports.trainAndPredictWithParam = function (req, res) {
    const tf = require("@tensorflow/tfjs");
    require("@tensorflow/tfjs-node");
  
    // Load symptoms training and testing data
    const symptoms = require("../symptoms.json");
    const symptomsTest = require("../symptoms-test.json");
  
    // Convert/setup our data for tensorflow.js
    const trainingData = tf.tensor2d(
      symptoms.map((item) => [
        item.age,
        item.sex,
        item.bmi,
        item.fever,
        item.fatigue,
        item.respiratory_symptoms,
        item.gastrointestinal_symptoms,
        item.headache,
        item.skin_symptoms,
        item.joint_pain,
        item.muscle_pain,
        item.swollen_lymph_nodes,
        item.mental_health_symptoms,
      ])
    );
  
    const outputData = tf.tensor2d(
      //symptoms.map((item) => [item.target === 0 ? 1 : 0, item.target === 1 ? 1 : 0])
      symptoms.map((item) => [
        item.doctor_visit_needed === "no" ? 1 : 0,
        item.doctor_visit_needed === "yes" ? 1 : 0,
      ])
    );
  
    const testData = [
      req.body.age,
      req.body.sex,
      req.body.bmi,
      req.body.fever,
      req.body.fatigue,
      req.body.respiratory_symptoms,
      req.body.gastrointestinal_symptoms,
      req.body.headache,
      req.body.skin_symptoms,
      req.body.joint_pain,
      req.body.muscle_pain,
      req.body.swollen_lymph_nodes,
      req.body.mental_health_symptoms,
    ];
    console.log("testData>>>", testData);
    const testShape = [1, 13];
    const testDatatype = "float32";
    const testingData = tf.tensor2d(testData, testShape, testDatatype);
  
    // Build neural network using a sequential model
    const model = tf.sequential();
  
    // Add the first layer
    model.add(
      tf.layers.dense({
        inputShape: [13],
        activation: "sigmoid",
        units: 30,
      })
    );
  
    // Add the first hidden layer
    model.add(
      tf.layers.dense({
        inputShape: [30],
        activation: "sigmoid",
        units: 15,
      })
    );
  
    // Add the second hidden layer
    model.add(
      tf.layers.dense({
        inputShape: [15],
        activation: "sigmoid",
        units: 2,
      })
    );
  
    // Add output layer
    model.add(
      tf.layers.dense({
        activation: "sigmoid",
        units: 2,
      })
    );
  
    // Compile the model with an MSE loss function and Adam algorithm
    model.compile({
      loss: "meanSquaredError",
      optimizer: tf.train.adam(0.003),
      metrics: ["accuracy"],
    });
  
    // Train/fit the model for the fixed number of epochs
    const startTime = Date.now();
    //
    async function run() {
      const startTime = Date.now();
      //train the model using fit method
      await model.fit(trainingData, outputData, {
        epochs:50,
        epochs: 200, //number of iterations
        callbacks: {
          onEpochEnd: async (epoch, log) => {
            console.log(`Epoch ${epoch}: loss = ${log.loss}`);
            elapsedTime = Date.now() - startTime;
            console.log("elapsed time: " + elapsedTime);
          },
        },
      }); //fit
      // predict using predict method
      const results = model.predict(testingData);
      results.print();
      // get the values from the tf.Tensor
      //var tensorData = results.dataSync();
      results.array().then((array) => {
        console.log(array[0][0]);
        var resultForData1 = array[0][0];
        var resultForData2 = array[0][1];
  
        var dataToSent = {
          row1: resultForData1,
          row2: resultForData2,
        };
        res.status(200).send(dataToSent);
        console.log("data>>>>>>", dataToSent);
      });
    } //end of run function
    run();
    //
  };
  