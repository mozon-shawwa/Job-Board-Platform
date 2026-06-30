const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createJob = async (req, res, next) => {
  try {
    const { title, description, location, salaryMin, salaryMax, type, category } = req.body;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        type,
        category,
        employerId: req.user.id
      },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          }
        }
      }
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      type,
      category,
      minSalary,
      maxSalary,
      active
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      isActive: active === undefined ? true : active === 'true'
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (minSalary) {
      where.salaryMin = { gte: parseInt(minSalary) };
    }

    if (maxSalary) {
      where.salaryMax = { lte: parseInt(maxSalary) };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          employer: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true
            }
          },
          _count: {
            select: { applications: true }
          }
        }
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          }
        },
        applications: {
          include: {
            candidate: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, location, salaryMin, salaryMax, type, category, isActive } = req.body;

    const existingJob = await prisma.job.findUnique({ where: { id } });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (existingJob.employerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        description,
        location,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        type,
        category,
        isActive
      },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true
          }
        }
      }
    });

    res.json(job);
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingJob = await prisma.job.findUnique({ where: { id } });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (existingJob.employerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    try {
      await prisma.job.delete({ where: { id } });
    } catch (deleteError) {
      if (deleteError.code === 'P2003') {
        return res.status(409).json({
          error: 'Cannot delete this job because it has existing applications. Consider deactivating it instead.',
        });
      }
      throw deleteError;
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { employerId: req.user.id },
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};