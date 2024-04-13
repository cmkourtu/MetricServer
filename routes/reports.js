const router = require("express").Router();
const reportService = require("../services/reports-service");
const {cacheAdSetsInsightReportByUserId} = require("../services/cache-service");
const passport = require("passport");

/**
 * @typedef {object} ReportData
 * @property {string} name
 * @property {string} description
 * @property {string} userId
 */

/**
 * POST /api/reports
 * @summary Create a new report
 * @tags Reports
 * @param {ReportData} request.body - Report data
 * @return {Report} 201 - The created report
 * @return {string} 400 - Invalid request body
 * @security JWT
 */
router.post("/", async (req, res) => {
    try {
        const report = await reportService.createReport(req.body);
        res.status(201).json(report);
    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Invalid request body"});
    }
});

/**
 * GET /api/reports
 * @summary Get all reports
 * @tags Reports
 * @return {Array<Report>} 200 - Array of reports
 * @security JWT
 */
router.get("/", async (req, res) => {
    try {
        const reports = await reportService.getAllReports();
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

/**
 * GET /api/reports/:reportId
 * @summary Get a report by ID
 * @tags Reports
 * @param {string} reportId.path.required - ID of the report
 * @return {Report} 200 - The requested report
 * @return {string} 404 - Report not found
 * @security JWT
 */
router.get("/:reportId", async (req, res) => {
    const reportId = req.params.reportId;
    try {
        const report = await reportService.getReportById(reportId);
        if (!report) {
            res.status(404).json({error: "Report not found"});
            return;
        }
        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

/**
 * GET /api/reports/user/:userId
 * @summary Get reports by user ID
 * @tags Reports
 * @param {string} userId.path.required - ID of the user
 * @return {Array<Report>} 200 - Array of reports belonging to the user
 * @return {string} 404 - User not found
 * @security JWT
 */
router.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const reports = await reportService.getReportsByUserId(userId);
        if (reports.length === 0) {
            res.status(404).json({error: "No reports found for the user"});
            return;
        }
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

/**
 * PUT /api/reports/:reportId
 * @summary Update a report by ID
 * @tags Reports
 * @param {string} reportId.path.required - ID of the report
 * @param {ReportData} request.body - Updated report data
 * @return {Report} 200 - The updated report
 * @return {string} 400 - Invalid request body
 * @return {string} 404 - Report not found
 * @security JWT
 */
router.put("/:reportId",  passport.authenticate("jwt"),async (req, res) => {
    const reportId = req.params.reportId;
    const userId = req.user.id;
    try {
        const oldReport = await reportService.getReportById(reportId);
        if(!(oldReport.startDate === req.body.startDate && oldReport.endDate === req.body.endDate)){
            const {startDate, endDate} = req.body;
            await cacheAdSetsInsightReportByUserId(userId, reportId, "date", startDate, endDate);
        }
        const report = await reportService.updateReport(reportId, req.body);
        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Invalid request body"});
    }
});

/**
 * DELETE /api/reports/:reportId
 * @summary Delete a report by ID
 * @tags Reports
 * @param {string} reportId.path.required - ID of the report
 * @return {string} 200 - Report deleted successfully
 * @return {string} 404 - Report not found
 * @security JWT
 */
router.delete("/:reportId", async (req, res) => {
    const reportId = req.params.reportId;
    try {
        await reportService.deleteReport(reportId);
        res.json({message: "Report deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;
