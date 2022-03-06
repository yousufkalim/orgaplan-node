const Question = require("../../models/question");
const QuestionSolutionStep = require("../../models/questionSolutionStep");
const STRINGS = require("../../utils/texts");
const Validations = require("../../validators");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");

const ENV = process.env;

class SuperAdminFaqController {

  /**
   * Get all Questions
   * @param {*} req 
   * @param {*} res 
   */
  async getAllQuestions(req, res) {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const question = req.query.question || "";
    const mongooseRequest = (question === "") ? 
        {} : 
        { "question": { $regex: `${question}`, $options: "i" } };

    // find total questions
    const totalItems = await Question.find(mongooseRequest).countDocuments();

    // find questions
    const items = await Question.find(mongooseRequest, { __v: 0, password: 0 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (!items) throw new CustomError(STRINGS.ERRORS.error);

    const result = {
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
      itemsPerPage: ITEMS_PER_PAGE,
      currentPage: page,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
    };

    res.status(200).send(response(STRINGS.TEXTS.questionsRequested, result));
  }

  /**
   * Get a Question with the Answer and the Steps
   * @param {*} req 
   * @param {*} res 
   */
  async getQuestionById(req, res) {
    const questionId = req.params.id;

    // find question
    const question = await Question.findOne({ _id: questionId }, { password: 0, __v: 0 })
      .populate("steps");
    if (!question) throw new CustomError(STRINGS.ERRORS.questionNotFound);

    res.status(200).send(response(STRINGS.TEXTS.questionsRequested, question));
  }
  
  /**
   * Create a Question with an Answer
   * @param {*} req 
   * @param {*} res 
   */
  async createQuestion(req, res) {
    const params = req.body;
    const validatedData = Validations.faq.createQuestion(params);

    // create question
    const createdQuestion = await new Question({
      question: validatedData.question,
      answer: validatedData.answer,
      steps: []
    }).save();

    res.status(201).send(response(STRINGS.TEXTS.questionCreated, createdQuestion));
  }

  /**
   * Update a Question or and Answer
   * @param {*} req 
   * @param {*} res 
   */
  async updateQuestion(req, res) {
    const questionId = req.params.id;

    if(questionId !== req.body?._id) throw new CustomError("Les ids ne correspondent pas", 400);

    // find question
    const actualQuestion = await Question.findById(questionId);
    if (!actualQuestion) throw new CustomError(STRINGS.ERRORS.questionNotFound, 404);

    // update question
    const validatedData = Validations.faq.updateQuestion(req.body);
    const updatedQuestion = await Question.findByIdAndUpdate(
      { _id: questionId },
      { $set: { question: validatedData.question, answer: validatedData.answer}}
    );

    res.status(200).send(response(STRINGS.TEXTS.questionUpdated, updatedQuestion));
  }

  /**
   * Delete Question and the Answer and all the Steps
   * @param {*} req 
   * @param {*} res 
   */
  async deleteQuestionById(req, res) {
    const questionId = req.params.id;

    // find question
    const question = await Question.findById(questionId);
    if(!question) throw new CustomError(STRINGS.ERRORS.questionNotFound, 404);

    // delete question
    const deletedQuestion = await Question.findByIdAndDelete(questionId).populate("steps");

    if(deletedQuestion.steps?.length > 0) {
      // find each associated steps & delete them
      await QuestionSolutionStep.deleteMany({ _id: { $in: deletedQuestion.steps } });
    }

    res.status(200).send(response(STRINGS.TEXTS.questionDeleted, deletedQuestion));
  }

  /**
   * Add a Step on a Question
   * @param {*} req 
   * @param {*} res 
   */
  async addStep(req, res) {
    const body = req.body;
    const questionId = req.params.id;

    // find associated question
    const associatedQuestion = await Question.findById(questionId);
    if(!associatedQuestion) throw new CustomError(STRINGS.ERRORS.questionNotFound, 404);
    if(associatedQuestion?.steps?.length === 5) throw new CustomError(STRINGS.ERRORS.questionStepsMaximumNumberLimit, 400);

    // create step
    const validatedData = Validations.faq.createQuestionSolutionStep(body);

    let picture = req.file?.path
    const createdStep = await new QuestionSolutionStep({
      picture: picture,
      text: validatedData.text
    }).save();

    // update associated step ids in question
    const updatedSteps = [...associatedQuestion.steps];
    updatedSteps.push(createdStep._id);

    await Question.findByIdAndUpdate(
      { _id: questionId },
      { $set: { steps: updatedSteps } 
      }
    );

    res.status(201).send(response(STRINGS.TEXTS.questionSolutionStepCreated, createdStep));
  }

  /**
   * Update a Step of a Answer
   * @param {*} req 
   * @param {*} res 
   */
  async updateStep(req, res) {
    const body = req.body;
    const questionId = req.params.id;
    const stepId = req.params.stepId;

    if(stepId !== body?._id) throw new CustomError("Les ids ne correspondent pas", 400);

    // find associated question
    const associatedQuestion = await Question.findById(questionId);
    if(!associatedQuestion) throw new CustomError(STRINGS.ERRORS.questionNotFound, 404);

    // find step
    const step = QuestionSolutionStep.findById(stepId);
    if(!step) throw new CustomError(STRINGS.ERRORS.questionSolutionStepNotFound, 404);

    // update step
    const validatedData = Validations.faq.updateQuestionSolutionStep(body);

    let picture = req.file?.path
    const updatedStep = await QuestionSolutionStep.findByIdAndUpdate(
      { _id: stepId },
      { $set: {
          picture: picture,
          text: validatedData.text,
        } 
      }
    );

    res.status(200).send(response(STRINGS.TEXTS.questionSolutionStepUpdated, updatedStep));
  }

  /**
  * Delete a Step from a Question
  * @param {*} req 
  * @param {*} res 
  */
  async deleteStepById(req, res) {
    const questionId = req.params.id;
    const stepId = req.params.stepId;
  
    // find associated question
    const associatedQuestion = await Question.findById(questionId);
    if(!associatedQuestion) throw new CustomError(STRINGS.ERRORS.questionNotFound, 404);

    // find step
    const step = QuestionSolutionStep.findById(stepId);
    if(!step) throw new CustomError(STRINGS.ERRORS.questionSolutionStepNotFound, 404);
  
    // delete step
    const stepDeleted = await QuestionSolutionStep.findByIdAndDelete(stepId);
  
    // update associated step ids in question
    const updatedSteps = associatedQuestion.steps.filter(id => id.toString() !== stepId);
  
    await Question.findByIdAndUpdate(
      { _id: questionId },
      { $set: { steps: updatedSteps } 
      }
    );
  
    res.status(200).send(response(STRINGS.TEXTS.questionSolutionStepDeleted, stepDeleted));
  }
}

module.exports = new SuperAdminFaqController();
