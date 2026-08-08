import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  // Find all blogs from MySQL. Sort newest first.
  async findAll(publishedOnly = false) {
    console.log('Finding blog posts. Published only filter:', publishedOnly);
    
    const where: any = {};
    if (publishedOnly === true) {
      where.published = true;
    }
    
    const blogList = await this.blogRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
    return blogList;
  }

  // Find one specific blog post by ID
  async findOne(id: string) {
    console.log(`Finding blog with ID: ${id}`);
    const foundBlog = await this.blogRepository.findOne({ where: { id } });
    if (!foundBlog) {
      throw new NotFoundException('Blog post could not be found');
    }
    return foundBlog;
  }

  // Find one specific blog by its slug (for public URLs)
  async findBySlug(slug: string) {
    console.log(`Finding blog with slug: ${slug}`);
    const foundBlog = await this.blogRepository.findOne({ where: { slug } });
    if (!foundBlog) {
      throw new NotFoundException('Blog post slug could not be found');
    }
    return foundBlog;
  }

  // Create new blog and generate user-friendly URL slug
  async create(data: Partial<Blog>) {
    console.log('Creating new blog post...');
    
    // Generate simple url slug from title if not provided
    if (!data.slug && data.title) {
      const slugText = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphen
        .replace(/(^-|-$)/g, '');    // Trim hyphens from start and end
      data.slug = await this.ensureUniqueSlug(slugText);
    }
    
    try {
      const newBlog = this.blogRepository.create(data);
      const savedBlog = await this.blogRepository.save(newBlog);
      return savedBlog;
    } catch (error: any) {
      console.error('Blog create failed:', error?.message || error);
      throw error;
    }
  }

  private async ensureUniqueSlug(baseSlug: string) {
    let slug = baseSlug || `blog-${Date.now()}`;
    let attempt = 0;
    while (attempt < 20) {
      const existing = await this.blogRepository.findOne({ where: { slug } });
      if (!existing) return slug;
      attempt += 1;
      slug = `${baseSlug}-${attempt + 1}`;
    }
    return `${baseSlug}-${Date.now()}`;
  }

  // Edit blog post details by ID
  // Edit blog post details by ID
  async update(id: string, data: Partial<Blog>) {
    console.log(`Updating blog post ID: ${id}`);
    
    // First, verify the blog exists
    const existingBlog = await this.findOne(id);

    // Safety guard: never let a blank/empty submission wipe out real
    // existing content. If the incoming value is empty, drop it from
    // the update so the previously-saved value is kept instead.
    if (data.content !== undefined && String(data.content).trim() === '') {
      console.log('Update sent empty content — keeping existing content instead');
      delete data.content;
    }
    if (
      data.sections !== undefined &&
      (!Array.isArray(data.sections) || data.sections.length === 0)
    ) {
      console.log('Update sent empty sections — keeping existing sections instead');
      delete data.sections;
    }
    
    // Merge the new data onto the existing blog
    const updatedBlog = await this.blogRepository.save({
      ...existingBlog,
      ...data,
    });
    
    return updatedBlog;
  }

  // Delete blog post by ID
  async remove(id: string) {
    console.log(`Deleting blog post ID: ${id}`);
    const result = await this.blogRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Blog post to delete could not be found');
    }
    return { message: 'Blog deleted successfully' };
  }
}
