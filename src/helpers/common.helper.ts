import { BadRequestException } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';

export async function checkUnique<T>(
    model: Model<T>,
    field: keyof T,
    value: any,
    errorMessage?: string,
): Promise<void> {
    const filter: FilterQuery<T> = { [field]: value } as FilterQuery<T>;
    const existing = await model.findOne(filter);
    if (existing) {
        throw new BadRequestException({
            message: "Bad Request!",
            errors: [errorMessage || `Interest name '${value}' already exists.`]
        });
    }
}

export async function checkExistingUser<T>(
    id: string,
    model,
    column
) {
    const isInUse = await model.exists({ column: id });
    if (isInUse) {
        throw new BadRequestException({
            message: 'Bad Request!',
            errors: [`Cannot delete ${column}; its in use.`],
        });
    }
}

export async function calculateQuestionnaireFactor(userAnswers) {
    let questionnaire_factor = 0;
    let habit_hours = 0;
    if (userAnswers.length > 0) {
        userAnswers.forEach(element => {
            if (element.question_option.length > 0) {
                element.question_option.forEach(option => {
                    questionnaire_factor = questionnaire_factor + option.value;
                });
            } else if (element.question && element.question.length > 0 && element.question[0].question == 'On average, how long do you sleep at night?') {
                habit_hours = 24 - element.answer;
            }
        });
    }
    return { habit_hours: habit_hours, questionnaire_factor: questionnaire_factor };
}

export async function calculateTqpWaitFactor(tqp_total_survey_factor) {
    let tqp_wait_factor = 0;
    if (tqp_total_survey_factor < -1) {
        tqp_wait_factor = 15;
    } else if (tqp_total_survey_factor < 0 && tqp_total_survey_factor > -1) {
        tqp_wait_factor = 30;
    } else if (tqp_total_survey_factor == 0) {
        tqp_wait_factor = 45;
    } else if (tqp_total_survey_factor > 1) {
        tqp_wait_factor = 60;
    }
    return tqp_wait_factor;
}

export async function analyzeSmokeData(data: any[]) {
    let totalIntakes = 0;
    let totalWaitTime = 0;
    let recordCount = 0;

    const timeOfDayFrequency: Record<string, number> = {};
    const dayOfWeekFrequency: Record<string, number> = {};

    data.forEach(entry => {
        totalIntakes += entry.totalIntakes;

        entry.records.forEach(record => {
            recordCount++;
            totalWaitTime += record.wait_time || 0;

            // Count time_of_day
            timeOfDayFrequency[record.time_of_day] = (timeOfDayFrequency[record.time_of_day] || 0) + 1;

            // Count day_of_week
            dayOfWeekFrequency[record.day_of_week] = (dayOfWeekFrequency[record.day_of_week] || 0) + 1;
        });
    });

    const averageTotalIntakes = data.length > 0 ? totalIntakes / data.length : 0;
    const averageWaitTime = recordCount > 0 ? totalWaitTime / recordCount : 0;

    const frequentTimeOfDay = Object.entries(timeOfDayFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const frequentDayOfWeek = Object.entries(dayOfWeekFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
        averageTotalIntakes: parseFloat(averageTotalIntakes.toFixed(2)),
        averageWaitTime: parseFloat(averageWaitTime.toFixed(2)),
        frequentTimeOfDay,
        frequentDayOfWeek,
    };
}

export async function checkGoalMet(tqp_wait_goal, user_wait_time) {
    let goal_met = { message: "", goal_met: "" };
    if (tqp_wait_goal < Number(user_wait_time)) {
        goal_met.message = "INCREASE AVG TIME";
        goal_met.goal_met = "yes";
    } else if (tqp_wait_goal > Number(user_wait_time)) {
        goal_met.message = "MISSED AVG TIME";
        goal_met.goal_met = "no";
    } else if (tqp_wait_goal == Number(user_wait_time)) {
        goal_met.message = "MAINTAIN AVG TIME";
        goal_met.goal_met = "yes";
    }
    return goal_met;
}

export async function getPreviousDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    return yesterdayFormatted;
}

export async function addDaysInDate(date, days) {
    const existingDate = new Date(date);
    existingDate.setDate(existingDate.getDate() + days);
    const yesterdayFormatted = existingDate.toISOString().split('T')[0];
    return yesterdayFormatted;
}

export async function findParticularFieldPercentage(
    data: any[],
    first_column: string,
    first_value: any,
    second_value: any | null,
    second_column
): Promise<number> {
    const totalCount = data.length;
    let matchCount = 0;

    if ((second_column && second_column != '') && (second_value && second_value != '')) {
        matchCount = data.filter(entry => (entry[first_column] === first_value) && (entry[second_column] === second_value)).length;
    } else {
        matchCount = data.filter(entry => entry[first_column] === first_value).length;
    }

    const percentage = totalCount > 0 ? (matchCount / totalCount) * 100 : 0;

    return Number(percentage.toFixed(2));
}

export async function calculateDailyInstanceStepFactor(value: number) {
    let daily_instance_step_factor = 0;
    if (value > 0 && value <= 25) {
        daily_instance_step_factor = 0;
    } else if (value > 25 && value <= 50) {
        daily_instance_step_factor = -0.5;
    } else if (value > 50 && value <= 100) {
        daily_instance_step_factor = -1.0;
    }
    return daily_instance_step_factor;
}

export async function calculateFreqDayFactor(value: number) {
    let freq_day_factor = 0;
    if (value > 0 && value <= 25) {
        freq_day_factor = -1;
    } else if (value > 25 && value <= 50) {
        freq_day_factor = -0.5;
    } else if (value > 50 && value <= 100) {
        freq_day_factor = -0.25;
    }
    return freq_day_factor;
}


// export const profileImageUploadHelper = {
//     storage: diskStorage({
//         destination: (req, file, cb) => {
//             const uploadPath = './uploads/profile-pictures';

//             // ✅ Ensure directory exists
//             if (!fs.existsSync(uploadPath)) {
//                 fs.mkdirSync(uploadPath, { recursive: true });
//             }

//             cb(null, uploadPath);
//         },
//         filename: (req, file, cb) => {
//             const uniqueName = `${uuid()}${extname(file.originalname)}`;
//             cb(null, uniqueName);
//         },
//     }),
//     fileFilter: (req, file, cb) => {
//         // if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
//         //     return cb(new Error('Only image files are allowed!'), false);
//         // }
//         cb(null, true);
//     },
//     limits: {
//         fileSize: 2 * 1024 * 1024, // 2MB max
//     },
// };

const uploadPaths: Record<string, string> = {
    profile_picture: 'profile-pictures',
    transport_operator_license: 'transport-operator-license',
    driver_license_front: 'driver-license',
    driver_license_back: 'driver-license',
    bank_statement: 'bank-statement',
    drivers_tag_license: 'drivers-tag-license',
    id_card_front: 'id-card',
    id_card_back: 'id-card',
    vat_certificate: 'vat-certificate',
};

export const fileUploadHelper = (basePath: string) => ({
    storage: diskStorage({
        destination: (req, file, cb) => {
            const folder = `${basePath}/${uploadPaths[file.fieldname] || 'other-files'}`;
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
            cb(null, folder);
        },
        filename: (req, file, cb) => cb(null, `${uuid()}${extname(file.originalname)}`),
    }),
    fileFilter: (req, file, cb) => cb(null, true),
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const promotionBannerUploadHelper = {
    storage: diskStorage({
        destination: './uploads/promotion-banner',
        filename: (req, file, cb) => {
            const uniqueName = `${uuid()}${extname(file.originalname)}`;
            cb(null, uniqueName);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max
    },
};

export function buildImageUrl(folder: string, filename?: string): string | null {
    if (!filename) return null;

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const cleanFolder = folder.replace(/^\/|\/$/g, ''); // remove any leading/trailing slashes
    const cleanFilename = filename.replace(/^\/+/, ''); // remove leading slashes

    return `${baseUrl}/uploads/${cleanFolder}/${cleanFilename}`;
}
