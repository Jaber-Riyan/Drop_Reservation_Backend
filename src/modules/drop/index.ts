/**
 * Drop module barrel export.
 *
 * This file exports everything related to the Drop module from a single entry point.
 * Other modules should import from here, not from individual files.
 *
 * Example:
 * import { Drop } from './modules/drop';
 * // instead of
 * import Drop from './modules/drop/drop.model';
 */

export { default as Drop } from './drop.model';
export { default as DropRepository } from './drop.repository';
export { default as DropService } from './drop.service';
export { default as DropController } from './drop.controller';
export { default as dropRoutes } from './drop.routes';
export type { IDrop, IDropCreation, IDropUpdate } from './drop.interface';