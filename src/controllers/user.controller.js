const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const existingResume = await prisma.resume.findUnique({
      where: { candidateId: req.user.id }
    });

    let resume;
    if (existingResume) {
      resume = await prisma.resume.update({
        where: { candidateId: req.user.id },
        data: {
          fileName: req.file.originalname,
          fileUrl
        }
      });
    } else {
      resume = await prisma.resume.create({
        data: {
          fileName: req.file.originalname,
          fileUrl,
          candidateId: req.user.id
        }
      });
    }

    res.json({ 
      message: 'Resume uploaded successfully',
      resume
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        resume: true,
        applications: {
          include: {
            job: {
              include: {
                employer: {
                  select: {
                    name: true,
                    company: true
                  }
                }
              }
            }
          },
          orderBy: { appliedAt: 'desc' }
        },
        jobs: req.user.role === 'EMPLOYER' ? {
          include: {
            _count: {
              select: { applications: true }
            }
          }
        } : false
      }
    });

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};