import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';

const { AvailableTime } = model;


const ConsultantController = {
  async SubmitAvailableTime(req, res) {
    try {
      const { uuid } = req.userData;
      const { availableTime } = req.body;
      const dataToSave = await availableTime.map((x) => ({
        consultant_uuid: uuid,
        available_time: x
      }));
      await AvailableTime.bulkCreate(dataToSave);
      return sendSuccessResponse(res, 200, 'operation successful');
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, 'INTERNAL SERVER ERROR');
    }
  },

  //  get available days and time consultant
  async getConsultantAvailableDays(req, res) {
    try {
      const { consultantUuid } = req.query;
      const availableTimes = await AvailableTime.findAll({
        where: { consultant_uuid: consultantUuid }
      });
      return sendSuccessResponse(res, 200, availableTimes);
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, 'INTERNAL SERVER ERROR');
    }
  }
};

export default ConsultantController;
