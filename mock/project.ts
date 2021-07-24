import { Project } from '../src/controller/project';

const projectMock = new Project({
    name: 'Test Project',
    path: process.cwd()
});

export default projectMock;