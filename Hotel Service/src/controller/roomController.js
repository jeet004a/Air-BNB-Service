import { createRoomService, getAllRoomsAdminService, getAllRoomsService, adminRoomValidationService } from '../services/roomService.js'
import client from '../elasticSearch/elasticSearchService.js'

export const roomController = async(req, res, next) => {
    try {
        const { email } = req.user

        const response = await createRoomService({...req.body, email })
        console.log(response)
        if (!response) {
            return res.status(400).json({
                success: false,
                message: 'No room capacity left or room creation failed',
            })
        }
        return res.status(201).json({
            success: true,
            message: response,
        })

    } catch (error) {
        console.log('Error in create room router', error)
    }
}

export const getAllRoomsAdminControlller = async(req, res, next) => {
    try {
        const response = await getAllRoomsAdminService(req.user)
        return res.status(200).json({
            success: true,
            message: "fetched successfully",
            response
        })
    } catch (error) {
        console.log('Error in get all admin room router', error)
    }
}


export const getAllRoomsController = async(req, res, next) => {
    try {
        const response = await getAllRoomsService()
        return res.status(200).json({
            success: true,
            message: "All rooms fetched successfully",
            response
        })
    } catch (error) {
        console.log('error get all rooms controller', error)
    }
}



export const adminRoomValidationController = async(req, res, next) => {
    try {
        // console.log(req.query)
        const response = await adminRoomValidationService({ host_id: req.user.admin_id, ...req.query })
        if (response) {
            return res.status(200).json({
                success: true,
                message: "Admin validated"
            })
        }
        return res.status(200).json({
            success: false,
            message: "Admin is not authorized perform this action"
        })
    } catch (error) {
        console.log('error from admin room validation controller', error)
    }
}



//Elastic Search controller
export const elasticSearchController = async(req, res) => {
    const { q, city, roomType, minPrice, maxPrice } = req.query;

    const filters = [];

    // City filter
    if (city) {
        filters.push({
            term: {
                city: city.toLowerCase()
            }
        });
    }

    // Nested room filters
    const nestedRoomFilters = [];

    if (roomType) {
        nestedRoomFilters.push({
            term: {
                'rooms.roomType': roomType
            }
        });
    }

    if (minPrice || maxPrice) {
        nestedRoomFilters.push({
            range: {
                'rooms.PPN': {
                    gte: minPrice ? parseInt(minPrice) : undefined,
                    lte: maxPrice ? parseInt(maxPrice) : undefined
                }
            }
        });
    }

    try {
        const result = await client.search({
            index: 'hotels',
            query: {
                bool: {
                    must: q ? [{
                        multi_match: {
                            query: q,
                            fields: ['name', 'description', 'rooms.description'],
                            fuzziness: 'AUTO'
                        }
                    }] : [],
                    filter: [
                        ...filters,
                        ...(nestedRoomFilters.length > 0 ? [{
                            nested: {
                                path: 'rooms',
                                query: {
                                    bool: {
                                        filter: nestedRoomFilters
                                    }
                                }
                            }
                        }] : [])
                    ]
                }
            }
        });

        const hits = result.hits.hits.map(hit => hit._source);

        return res.status(200).json({
            success: true,
            message: 'Search successful',
            data: hits
        });
    } catch (error) {
        console.error('Search failed:', error);
        return res.status(500).json({
            success: false,
            message: 'Search failed',
            //   error: error.message
        });
    }
}