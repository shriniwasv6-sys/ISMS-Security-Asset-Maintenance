const sitesService = require("../services/sitesService");

async function getAllSites(req, res) {

    try {

        const sites = await sitesService.getAllSites();

        res.json(sites);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

async function getSiteById(req, res) {

    try {

        const site = await sitesService.getSiteById(req.params.id);

        if (!site) {

            return res.status(404).json({

                message: "Site not found"

            });

        }

        res.json(site);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

async function createSite(req, res) {

    try {

        const site = await sitesService.createSite(req.body);

        res.status(201).json({

            message: "Site created successfully",

            site

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

async function updateSite(req, res) {

    try {

        const site = await sitesService.updateSite(req.params.id, req.body);

        res.json({

            message: "Site updated successfully",

            site

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

async function deleteSite(req, res) {

    try {

        await sitesService.deleteSite(req.params.id);

        res.json({

            message: "Site deleted successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

module.exports = {

    getAllSites,

    getSiteById,

    createSite,

    updateSite,

    deleteSite

};