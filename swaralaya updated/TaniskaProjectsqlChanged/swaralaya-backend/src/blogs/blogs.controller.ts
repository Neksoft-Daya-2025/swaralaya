import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// This controller handles all /api/blogs/* HTTP routes.
// It connects frontend requests to the BlogsService logic.
// Routes marked with @UseGuards(JwtAuthGuard) require a valid admin JWT token.
@Controller('api/blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  // -----------------------------------------------
  // GET /api/blogs
  // Public route — returns all published blog posts.
  // If ?all=true is passed in the URL, returns ALL posts
  // (including drafts). Used by the admin dashboard.
  // -----------------------------------------------
  @Get()
  getAllBlogs(@Query('all') all: string) {
    // When the admin passes ?all=true, show everything. Otherwise only published ones.
    const onlyPublished = all !== 'true';
    return this.blogsService.findAll(onlyPublished);
  }

  // -----------------------------------------------
  // POST /api/blogs/upload-image
  // Protected route (admin only).
  // Accepts a single image file and saves it to the uploads folder.
  // Returns the URL path to the saved image.
  // -----------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',                 // Where files are saved on the server
      filename: (req, file, callback) => {
        // Generate a unique filename to avoid conflicts
        const uniquePart = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = extname(file.originalname); // e.g. ".jpg" or ".png"
        callback(null, `img-${uniquePart}${fileExtension}`);
      },
    }),
  }))
  uploadSectionImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { url: '' };  // No file was uploaded
    }
    // Return the URL path so the frontend can display the image
    return { url: `/uploads/${file.filename}` };
  }

  // -----------------------------------------------
  // GET /api/blogs/:id
  // Public route — returns a single blog post by ID.
  // Used when a reader clicks "Read More" on the site.
  // Must be registered AFTER static paths like upload-image.
  // -----------------------------------------------
  @Get(':id')
  getSingleBlog(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  // -----------------------------------------------
  // POST /api/blogs
  // Protected route (admin only).
  // Creates a new blog post. Accepts multipart/form-data
  // so the cover image file can be uploaded alongside the text fields.
  // -----------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('coverImage', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniquePart = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = extname(file.originalname);
        callback(null, `blog-${uniquePart}${fileExtension}`);
      },
    }),
  }))
  createBlog(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    // If a cover image was uploaded, add its path to the request body
    if (file) {
      body.coverImage = `/uploads/${file.filename}`;
    }

    // The sections array is sent as a JSON string from the frontend
    // We need to parse it back into a real JavaScript array
    if (typeof body.sections === 'string') {
      try {
        body.sections = JSON.parse(body.sections);
      } catch (parseError) {
        console.log('Could not parse sections JSON — setting empty array');
        body.sections = [];
      }
    }

    // Convert published status from string ('true' / 'false') to boolean
    if (body.published !== undefined) {
      body.published = body.published === 'true' || body.published === true;
    }

    return this.blogsService.create(body);
  }

  // -----------------------------------------------
  // PUT /api/blogs/:id
  // Protected route (admin only).
  // Updates an existing blog post by ID.
  // Also handles optional new cover image uploads.
  // -----------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('coverImage', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniquePart = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = extname(file.originalname);
        callback(null, `blog-${uniquePart}${fileExtension}`);
      },
    }),
  }))
  updateBlog(@Param('id') id: string, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    // Add new cover image path if a file was uploaded
    if (file) {
      body.coverImage = `/uploads/${file.filename}`;
    }

    // Same as in createBlog: parse the sections JSON string
    if (typeof body.sections === 'string') {
      try {
        body.sections = JSON.parse(body.sections);
      } catch (parseError) {
        console.log('Could not parse sections JSON during update — setting empty array');
        body.sections = [];
      }
    }

    // Convert published status from string ('true' / 'false') to boolean
    if (body.published !== undefined) {
      body.published = body.published === 'true' || body.published === true;
    }

    return this.blogsService.update(id, body);
  }

  // -----------------------------------------------
  // DELETE /api/blogs/:id
  // Protected route (admin only).
  // Permanently deletes a blog post from the database.
  // -----------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteBlog(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
