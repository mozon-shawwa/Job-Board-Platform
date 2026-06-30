const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ error: 'Job is not active' });
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: req.user.id,
          jobId
        }
      }
    });

    if (existingApplication) {
      return res.status(409).json({ error: 'You have already applied to this job' });
    }

    const application = await prisma.application.create({
      data: {
        candidateId: req.user.id,
        jobId,
        coverLetter: coverLetter || null
      },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                company: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      where: { candidateId: req.user.id },
      include: {
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                company: true
              }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

exports.getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.employerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view applications for this job' });
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            resume: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.job.employerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                company: true
              }
            }
          }
        }
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.getApplicationStats = async (req, res, next) => {
  try {
    const stats = await prisma.application.groupBy({
      by: ['status'],
      where: {
        job: {
          employerId: req.user.id
        }
      },
      _count: true
    });

    const total = await prisma.application.count({
      where: {
        job: {
          employerId: req.user.id
        }
      }
    });

    res.json({
      total,
      breakdown: stats.map(s => ({
        status: s.status,
        count: s._count
      }))
    });
  } catch (error) {
    next(error);
  }
};