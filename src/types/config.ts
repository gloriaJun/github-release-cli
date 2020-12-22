import { IGitRepository } from './git';
import { IBranchType, ITag } from './release';

export interface IReleaseConfig {
  baseUrl: string;
  token: string;
  repo: IGitRepository;
  branch: IBranchType;
  tag?: ITag;
  release: {
    title: {
      major: string;
      minor: string;
      patch: string;
    };
  };
}
